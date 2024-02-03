# Midas Download Tool
[<img src="https://img.shields.io/badge/maintenance%20status-as%20is-yellow">](https://github.com/thavlik/t4vd)
[<img src="https://img.shields.io/badge/Language-javascript-lightblue.svg">](https://nodejs.org/en)
[<img src="https://img.shields.io/badge/License-Apache_2.0-orange.svg">](./LICENSE)
[<img src="https://img.shields.io/badge/License-MIT-lightblue.svg">](./LICENSE-MIT)

> ***UPDATE FEB 3, 2024: Since the [MIDAS platform has been retired by Kitware](https://discourse.slicer.org/t/retiring-midas-kitware-com-data-repository/), the CASILab brain MRI dataset can be downloaded as a ~5.2 GiB .zip file [here](https://casilab-brain-mri.nyc3.digitaloceanspaces.com/casilab-brain-mri-release.zip).***

This is a script that used [puppeteer](https://github.com/puppeteer/puppeteer) (headless Chrome) to download entire datasets presented through a web browser on the Kitware Midas platform. Originally, this tool was intended for downloading [Designed Database of MR Brain Images of Healthy Volunteers](https://www.insight-journal.org/midas/community/view/21), as it's unclear how else one should go about a bulk download. Seriously, where were the "Download as Zip" links?

## Requirements
- Docker

**OR**

- node.js (any version that supports puppeteer 2.0.0)
- curl
- the ability to run headless Chrome

## Usage
The script `sync.js` expects two arguments: the remote directory root and the output folder. Example:

```bash
$ mkdir download
$ docker run \
    -v $(pwd)/download thavlik/midas-download-tool:latest \
    https://insight-journal.org/midas/community/view/21 \
    /download
```

**OR**

```bash
$ node sync.js \
    https://insight-journal.org/midas/community/view/21 \
    $(pwd)/download
```

## Dataset Paper Citation
The MR brain images from healthy volunteers were collected and made available by the CASILab at The University of North Carolina at Chapel Hill and were distributed by the Midas Data Server at Kitware, Inc.

Bullitt E, Zeng D, Gerig G, Aylward S, Joshi S, Smith JK, Lin W, Ewend MG (2005) Vessel tortuosity and brain tumor malignancy: A blinded study. Academic Radiology 12:1232-1240

MIDAS platform bandwidth was generously provided by [The Insight Project](https://www.insight-journal.org/). The above download link is now paid for by [me](https://github.com/thavlik).

## License
### Data
The MRI data was made publicly available by CASILab at The University of North Carolina at Chapel Hill (UNC).

### Code
All code in this repository is released under [MIT](LICENSE-MIT) / [Apache 2.0](LICENSE-Apache) dual license, which is extremely permissive. Please open an issue if somehow these terms are insufficient.
