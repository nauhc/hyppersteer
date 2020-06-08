# Author: Chuan Wang
from json import loads
import pandas as pd
from rnn.biLSTM_inference import biLSTM_inference
from torch import from_numpy
from numpy import load, copy
from flask import Flask, jsonify, request
from flask_cors import CORS
from rnn.parameter import FEATURES
app = Flask(__name__)
CORS(app)


time = '20200115-194901'
best_epoch = 46
best_accuracy = 0.96
filepath = './data/mimic/'


def jsonData2numpy():
    return None


def numpyData2Json(input, featureIdx):
    T = input.shape[0]
    features = input[:, featureIdx]
    featuresDf = pd.DataFrame(
        features, index=['T' + str(t + 1) for t in range(T)])

    featuresDf.columns = featureIdx
    featuresDf['time'] = featuresDf.index

    return loads(featuresDf.round(2).to_json(orient='records'))


@app.route("/", methods=["POST", "GET"])
def index():
    return jsonify({'abc': 'ddd', 'bbd': 'ccc'})


@app.route("/predict", methods=["POST"])
def predict():

    data10 = load(filepath + 'random10_data.npy')
    labels10 = load(filepath + 'random10_labels.npy')

    # get updated input from frontend
    d = request.get_json()
    instanceId = d['instanceId']
    featureIdx = d['featureIdx']

    input = from_numpy(data10[instanceId])
    # print(numpyData2Json(input.numpy(), featureIdx))

    model = biLSTM_inference(filepath, time, best_epoch, best_accuracy)
    result = model.predict(input)

    # updated input
    updatedInput = copy(input)
    updatedDataDf = pd.DataFrame(d['updatedData'])
    for column in updatedDataDf.head():
        if (column != "time"):
            updatedInput[:, int(column)] = updatedDataDf[column]
    # prediction result for updated input
    updatedResult = model.predict(from_numpy(updatedInput))

    print('prediction result\n', result)
    print('updated prediction result\n', updatedResult)

    obj = {
        'xName': 'time',
        'yName': [str(i) for i in featureIdx],
        'yLabel': [FEATURES[i] for i in featureIdx],
        'instanceCnt': 10,
        'result':
            [{
                'class': 'dead',
                'original': round(result[0][0], 4),
                'predict':round(updatedResult[0][0], 4)
            },
            {
                'class': 'alive',
                'original': round(result[0][1], 4),
                'predict':round(updatedResult[0][1], 4)
            }],
        'original': numpyData2Json(input.numpy(), featureIdx),
        'updated': numpyData2Json(updatedInput, featureIdx)
    }
    return jsonify(obj)


if __name__ == "__main__":
    app.run(debug=True)
