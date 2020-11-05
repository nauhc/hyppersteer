[![MIT License][license-shield]][license-url]

<br />
<p align="center">
  <h3 align="center">HypperSteer </h3>
  <h4 align="center"> An Interactive Tool for Prescriptive Sequence Predictions with RNN </h4>
</p>

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Quick Start](#usage)
  - [Demo](#demo)
- [License](#license)
- [Contact](#contact)

## About The Project

### Built With

- [React](https://reactjs.org/)
- [deck.gl](https://deck.gl/)
- [REST API](https://restfulapi.net/)
- [PyTorch](https://pytorch.org/)

### Prerequisites

- npm

```sh
npm install npm@latest -g
```

- Python3

### Installation

1. Clone the repo

```sh
git clone https://github.com/nauhc/hyppersteer.git
```

3. Install NPM packages

```sh
npm install
```

## Usage

### Quick Start

This is an example of how to set up your project locally.
To get a local copy up and running follow these simple example steps, after installing all dependencies (root directory by default):

```
cd backend/
python3 api.py
```

to start the deep learning model server,
and

```
cd (root)
yarn start
```

to start the web-based UI for interactions.

### Demo

HypperSteer helps to explore individual data instances and their prediction results. Each dot in the 2D projection view represents an instance with its class represented by the color. Perturb any feature values at any time-steps and predict with the RNN model.

For the biLSTM model I trained, see [this repo](https://github.com/nauhc/bilstm-many-to-one).

In the following example, we train a biLSTM model that uses electronic health records to predict patients' mortality. The following demo showcases the health records of Patient 5000 (<font color = '#8884d8'>dead</font>) and Patient 7000 (<font color='#82ca9d'>alive</font>).
![Product Name Screen Shot][product-screenshot]

In the following example, perturbing Patient 6712's Joint Fluid value at the last three time-step alters the mortality prediction result from the dead to alive!
![Product Name Screen Shot][product-screenshot1]

But for a random patient, what features and what time-step to perturb for the desired result?
Our paper [HypperSteer](https://arxiv.org/abs/2011.02149.pdf) further discusses the counterfactual and partial dependence analysis for hypothetical steering.

Cite our paper if you find the source code or the paper to be helpful.

```
@misc{wang2020hyppersteer,
      title={HypperSteer: Hypothetical Steering and Data Perturbation in Sequence Prediction with Deep Learning},
      author={Chuan Wang and Kwan-Liu Ma},
      year={2020},
      eprint={2011.02149},
      archivePrefix={arXiv},
      primaryClass={cs.LG}
}
```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Link: [https://github.com/nauhc/hyppersteer](https://github.com/nauhc/hyppersteer)

<!-- [contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=flat-square
[contributors-url]: https://github.com/nauhc/hyppersteer/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=flat-square
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=flat-square
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=flat-square
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues -->

[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=flat-square
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt

<!-- [linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555 -->
<!-- [linkedin-url]: https://linkedin.com/in/othneildrew -->

[product-screenshot]: images/load-instance.gif
[product-screenshot1]: images/perturb.gif
