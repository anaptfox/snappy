var NodeWebcam = require('node-webcam');
var Webcam = NodeWebcam.create();

Webcam.list(function(list) {
  list.forEach((webcam) => console.log(webcam))
});
