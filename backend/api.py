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

dataset = load(filepath + 'unique_data/uniqDataLabelsIds')


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


@app.route("/counterfactual", methods=["POST"])
def counterfactual():

    d = request.get_json()
    instanceId = int(d['instanceId'])
    print('\n counterfactual instanceId', instanceId)

    arr = load(filepath + 'counterfactuals/all_counterfactuals20')
    print('\ncounterfactual data', arr.shape)

    # get counterfactuals for selected data
    jsonObjArr = []
    for ctfct in arr[instanceId]:
        jsonObjArr.append({
            'idx': ctfct[0],
            'dist': ctfct[1]
        })

    return jsonify(jsonObjArr)


@app.route("/pdplot", methods=["POST"])
def pdplot():
    return jsonify({'abc': 'ddd', 'bbd': 'ccc'})


@app.route("/predict", methods=["POST"])
def predict():
    d = request.get_json()
    instanceId = int(d['instanceId'])
    featureIdx = d['featureIdx']

    print('\n ---- predict instanceId', instanceId)
    # print('\n ---', d['updatedData'])

    # print(dataset['data'].shape)  # (14165, 48, 37)
    # print(dataset['labels'].shape)  # (14165, 2)
    # print(dataset['ids'].shape)  # (14165,)
    data = dataset['data']
    labels = dataset['labels']

    selectedDatum = data[instanceId]
    selectedLabel = labels[instanceId]

    # get updated input from frontend

    # input = from_numpy(selectedData[instanceId])
    input = from_numpy(selectedDatum)
    counterfactual = from_numpy(data[9009])
    # print(numpyData2Json(input.numpy(), featureIdx))

    model = biLSTM_inference(filepath, time, best_epoch, best_accuracy)
    result = model.predict(input)

    # updated input
    updatedInput = copy(input)
    # d['data2predict'] is empty [] at load and when inputing text id
    # d['data2predict'] has values when updating barchart values
    updatedDataDf = pd.DataFrame(d['data2predict'])
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
