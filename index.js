const NodeWebcam = require('node-webcam');
const Dropbox = require('dropbox');
const fs = require('fs');
const uuid = require('uuid/v4');
const Twitter = require('twitter');

const DROPBOX_ACCESS_TOKEN = '';
const LOSANT_DEVICE_ID = '';
const LOSANT_DEVICE_KEY = '';
const LOSANT_DEVICE_SECRET = '';
const WEBCAM_ONE = '/dev/video0';
const WEBCAM_TWO = '/dev/video1';
var client = new Twitter({consumer_key: '', consumer_secret: '', access_token_key: '', access_token_secret: ''});

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
    var tweet = command.payload.tweet
    WebcamOne.capture(uuid(), function(err, data) {
      if (err) {
        console.log('Couldn\'nt find webcam: ' + WEBCAM_ONE)
      } else {
        console.log(data)
        uploadFileAndTweet(data, tweet)
      }
    });
  } else if (command.name === 'takePictureTwo') {
    var tweet = command.payload.tweet
    WebcamTwo.capture(uuid(), function(err, data) {
      if (err) {
        console.log('Couldn\'nt find webcam: ' + WEBCAM_TWO)
      } else {
        console.log(data)
        uploadFileAndTweet(data, tweet)
      }
    });
  }
});

/**
 * Upload file to dropbox
 */
function uploadFileAndTweet(file, tweet) {
  console.log('Uploading to Dropbox');
  var dbx = new Dropbox({accessToken: DROPBOX_ACCESS_TOKEN});
  var fileContents = fs.readFileSync('./' + file)
  dbx.filesUpload({
    path: '/' + file + '.jpg',
    contents: fileContents
  }).then(function(response) {
    console.log('File uploaded to Dropbox');
    console.log('Uploading to Twitter');
    // Make post request on media endpoint. Pass file data as media parameter
    client.post('media/upload', {
      media: fileContents
    }, function(error, media, response) {

      if (!error) {

        // If successful, a media object will be returned.
        console.log('File uploaded to Twitter');
        console.log('Tweeting...');
        console.log('Here is the tweet: ' + tweet);

        // Lets tweet it
        var status = {
          status: tweet,
          media_ids: media.media_id_string // Pass the media id string
        }

        client.post('statuses/update', status, function(error, tweet, response) {
          if (!error) {
            console.log("Tweet was successful");
          } else {
            console.log("Tweet Failed");
            console.log(error)
          }
        });

      }
    });
    //console.log(response);
  }).catch(function(error) {
    console.log('File FAILED to upload:');
    console.error(error);
  });
  return false;
}

console.log('Listening for commands from Losant')
