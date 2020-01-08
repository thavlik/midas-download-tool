# Midas Download Tool
This is a script that uses [puppeteer](https://github.com/puppeteer/puppeteer) (headless Chrome) to download entire datasets presented through a web browser on the Kitware Midas platform. Originally, this tool was intended for downloading [Designed Database of MR Brain Images of Healthy Volunteers](https://www.insight-journal.org/midas/community/view/21), as it's unclear how else one should go about a bulk download. Seriously, where are the "Download as Zip" links?

## Requirements
- Docker

**OR**

- node.js (any version that supports puppeteer 2.0.0)
- curl
- the ability to run headless Chrome

## Usage
The script `sync.js` expects two arguments: the remote directory root and the output folder. Example:

`mkdir download && docker run -v $(pwd)/download thavlik/midas-download-tool:latest https://insight-journal.org/midas/community/view/21 /download`

**OR**

`node sync.js https://insight-journal.org/midas/community/view/21 $(pwd)/download`

## Dataset Paper Citation
The MR brain images from healthy volunteers were collected and made available by the CASILab at The University of North Carolina at Chapel Hill and were distributed by the Midas Data Server at Kitware, Inc.

Bullitt E, Zeng D, Gerig G, Aylward S, Joshi S, Smith JK, Lin W, Ewend MG (2005) Vessel tortuosity and brain tumor malignancy: A blinded study. Academic Radiology 12:1232-1240

The bandwidth is generously provided by [The Insight Project](https://www.insight-journal.org/).

## License
Released under MIT. Have fun!
