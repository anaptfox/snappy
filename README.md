# Snappy

This is a simple application that listen fors a webhook from Losant and takes a picture with a webcam.

## Installation

This installation assumes that you have a Raspberry Pi running the latest Jessie OS and connected to WiFi.

### Setup
1. `sudo su`
1. `sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get install fswebcam`
1. Install [Node.js](https://www.losant.com/blog/how-to-install-nodejs-on-raspberry-pi)
1. `git clone git@github.com/anaptfox/snappy.git`
1. `cd snappy`

### Config

There are five varuables in index.js

const DROPBOX_ACCESS_TOKEN = 'DROPBOX_ACCESS_TOKEN';
const LOSANT_DEVICE_ID = 'LOSANT_DEVICE_ID';
const LOSANT_DEVICE_KEY = 'LOSANT_DEVICE_KEY';
const LOSANT_DEVICE_SECRET = 'LOSANT_DEVICE_SECRET';
const WEBCAM_ONE = 'HUE HD Camera';
const WEBCAM_TWO = 'HUE HD Camera';

We'll need to update these.

### Find connected webcams

To find all the webcams connected, run:

`node list.js`

This will list of the connected webcams to assign to WEBCAM_ONE and WEBCAM_TWO
