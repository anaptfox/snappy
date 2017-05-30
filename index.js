const NodeWebcam = require('node-webcam');
const Dropbox = require('dropbox');
const fs = require('fs');
const uuid = require('uuid/v4');

const DROPBOX_ACCESS_TOKEN = 'DROPBOX_ACCESS_TOKEN';
const LOSANT_DEVICE_ID = 'LOSANT_DEVICE_ID';
const LOSANT_DEVICE_KEY = 'LOSANT_DEVICE_KEY';
const LOSANT_DEVICE_SECRET = 'LOSANT_DEVICE_SECRET';
const WEBCAM_ONE = 'HUE HD Camera';
const WEBCAM_TWO = 'HUE HD Camera';

var WebcamOne = NodeWebcam.create({device: WEBCAM_ONE});

var WebcamTwo = NodeWebcam.create({device: WEBCAM_TWO});

var Device = require('losant-mqtt').Device;

// Construct device.
var device = new Device({id: LOSANT_DEVICE_ID, key: LOSANT_DEVICE_KEY, secret: LOSANT_DEVICE_SECRET});

// Connect to Losant.
device.connect();

// Listen for commands.
device.on('command', function(command) {
  console.log('Command received.');
  console.log(command.name);
  if (command.name === 'takePictureOne') {
    WebcamOne.capture(uuid(), function(err, data) {
      if (err) {
        console.log('Couldn\'nt find webcam: ' + WEBCAM_ONE)
      } else {
        console.log(data)
        uploadFile(data)
      }
    });
  } else if (command.name === 'takePictureTwo') {
    WebcamTwo.capture(uuid(), function(err, data) {
      if (err) {
        console.log('Couldn\'nt find webcam: ' + WEBCAM_TWO)
      } else {
        console.log(data)
        uploadFile(data)
      }
    });
  }
});

/**
 * Upload file to dropbox
 */
function uploadFile(file) {
  var dbx = new Dropbox({accessToken: DROPBOX_ACCESS_TOKEN});
  var fileContents = fs.readFileSync('./' + file)
  dbx.filesUpload({
    path: '/' + file + '.jpg',
    contents: fileContents
  }).then(function(response) {
    console.log('File uploaded!');
    //console.log(response);
  }).catch(function(error) {
    console.log('File FAILED to upload:');
    console.error(error);
  });
  return false;
}

console.log('Listen for commands from Losant')
