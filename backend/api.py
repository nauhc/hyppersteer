# Author: Chuan Wang
import json
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

    return json.loads(featuresDf.round(2).to_json(orient='records'))


@app.route("/", methods=["POST", "GET"])
def index():
    return jsonify({'abc': 'ddd', 'bbd': 'ccc'})


@app.route("/predict", methods=["POST"])
def predict():

    # data10 = load(filepath + 'random10_data.npy')
    # labels10 = load(filepath + 'random10_labels.npy')
    data10 = load(filepath + 'data_6712.npy')
    labels10 = load(filepath + 'labels_6712.npy')
    # print('data10', data10[0, :,  [1, 30, 8, 2, 5, 21]])

    # get updated input from frontend
    d = request.get_json()
    instanceId = d['instanceId']
    featureIdx = d['featureIdx']

    # input = from_numpy(data10[instanceId])
    input = from_numpy(data10[0])
    counterfactual = from_numpy(data10[3])
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
        'instanceCnt': 7,
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
        'counterfactual': numpyData2Json(counterfactual.numpy(), featureIdx),
        'updated': numpyData2Json(updatedInput, featureIdx)
    }
    return jsonify(obj)


@app.route("/tsne", methods=["POST"])
def tsne():
    tsneFile = './data/mimic/tsne4vis.json'
    with open(tsneFile) as json_file:
        tsneData = json.load(json_file)
        return jsonify(tsneData)


if __name__ == "__main__":
    app.run(debug=True)
