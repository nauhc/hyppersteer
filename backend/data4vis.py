from os import path
import json
import numpy as np
from sklearn.manifold import TSNE
from torch import from_numpy


def featureSelection(n):
    if n > 16:
        n = 16
    selectedFeatureIdx_biLSTM = [1, 30, 8, 2, 5, 21, 26,
                                 3, 14, 6, 7, 10, 24, 23, 13, 36]  # top 16 features
    selectedFeatureIdx_LSTM = [14, 1, 8, 2, 30, 5, 21,
                               24, 28, 26, 3, 13, 7, 10, 27, 36]  # top 16 features

    # keep order of two arrays' intersection
    featureIdx = sorted(set(selectedFeatureIdx_biLSTM[:n]).intersection(
        selectedFeatureIdx_LSTM[:n]), key=lambda x: selectedFeatureIdx_biLSTM.index(x))
    return featureIdx


def loadData(n):
    datapath = './data/mimic/'
    ids = np.load(datapath + 'training_data/MIMIC_MV_data_hadmIds.npy')
    # print('ids.shape', ids.shape) # (25604,)
    uniqeIDs, uniqIdx, reconstructionIdx = (
        np.unique(ids, return_index=True, return_inverse=True))
    # in uniqIdx: 12894 are alive, 1271 are dead

    # 25604, 48, 37
    data = np.load(datapath + 'training_data/MIMIC_MV_data.npy')
    labels = np.load(datapath + 'training_data/MIMIC_MV_labels.npy')

    uniqData = data[uniqIdx]
    uniqlabels = labels[uniqIdx]
    # [16 19 32 ... 14139 14143 14158]
    negIdx = np.where(uniqlabels[:, 0] == 0)[0]

    if len(uniqData) != len(uniqlabels):
        print('data and labels have different intance number')
        return
    # print(uniqData.shape)  # (14165, 48, *)

    selectedFeatureIdx = featureSelection(n)  # 16 ->
    print('number of features picked by two RNN models:', len(selectedFeatureIdx))
    uniqData = uniqData[:, :, selectedFeatureIdx]
    # print(uniqData.shape)  # (14165, 48, *)
    dims = uniqData.shape
    uniqDataReshape = np.reshape(
        uniqData, (dims[0], dims[1] * dims[2]))

    # normalize data within each column(feature)
    max_perfeature = uniqData.max(axis=1).max(axis=0)
    # min_perfeature = uniqData.min(axis=1).min(axis=0)
    uniqData_normed = uniqData / max_perfeature

    uniqDataReshape_normed = np.reshape(
        uniqData_normed, (dims[0], dims[1] * dims[2]))

    return data, labels, \
        uniqData, uniqData_normed, \
        uniqDataReshape, uniqDataReshape_normed, \
        selectedFeatureIdx, negIdx, uniqIdx, max_perfeature


def tsne(mat):
    # data is a 2d array (instance count x feature dim)
    tsne_reslt = TSNE(n_components=2, learning_rate=700).fit_transform(
        mat)  # take long time
    # print tsne_reslt

    # normalize tsne
    dim0 = tsne_reslt[:, 0]
    dim1 = tsne_reslt[:, 1]
    normed_tsne = np.column_stack(
        ((dim0 - dim0.min()) / (dim0.max() - dim0.min()),
         (dim1 - dim1.min()) / (dim1.max() - dim1.min())))
    # save dict and return
    id_tsne_map = {}
    for i, t in zip(range(len(mat)), normed_tsne):
        id_tsne_map[i] = t.tolist()

    return id_tsne_map


def tsne_vis(data, n, labels, uniqIdx):
    paraStr = str(n)
    tsneFN = './data/mimic/mid_data/tsne' + paraStr + '.json'
    if not path.exists(tsneFN):
        print('tsneFN not exist, calculating...')
        id_tsne_map = tsne(data)
        with open(tsneFN, 'w') as file:
            file.write(json.dumps(id_tsne_map))
    with open(tsneFN) as json_file:
        tsneMap = json.load(json_file)

    tsneJsonObj = [{'id': int(k), 'x': tsneMap[k][0], 'y':tsneMap[k][1],
                    'color': 1, 'label': int(labels[uniqIdx[int(k)]][0])} for k in tsneMap.keys()]

    return tsneJsonObj


def main(n, distMetric, normalize):
    visDataPath = './data/mimic/'
    data, labels, uniqData, uniqData_normed, \
        uniqDataReshape, uniqDataReshape_normed, \
        selectedFeatureIdx, negIdx, uniqIdx, max_perfeature \
        = loadData(n)

    # tsne
    if normalize:
        tsneJsonObj = tsne_vis(uniqDataReshape_normed, n, labels, uniqIdx)
    else:
        tsneJsonObj = tsne_vis(uniqDataReshape, n, labels, uniqIdx)

    with open(visDataPath + 'tsne4vis.json', 'w') as file:
        file.write(json.dumps(tsneJsonObj))


    # sortedArr = np.load(nearestInstIdxSortedFN)
# for N in [4, 8]:
for n in [8]:
    # for distMetric in ['cosine', 'euclidean']:
    for distMetric in ['euclidean']:
        # for normalize in [False, True]:
        for normalize in [False]:
            main(n, distMetric, normalize)
