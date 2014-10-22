var canvas = $('#selfie')[0];
var ctx = canvas.getContext('2d');
var video  = document.createElement('video');
video.id="video";

var mask_img = new Image();
mask_img.src = "img/FaceMapMask.png";
var mask = document.createElement('canvas');
var maskPixels= ctx.getImageData(0, 0, mask.width, mask.height);
var maskData = maskPixels.data;

var initCam = function(){
  navigator.getMedia = ( navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

  if(navigator.getMedia == "undefined"){
    alert("webrtc is not supported on this browser. try chrome or firefox.");
  }

  navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
        }

        video.play();

        (function draw() {
          centerCanvas();

          ctx.beginPath();
          ctx.arc(canvas.width/2,canvas.height/2,200,0,Math.PI*2,true);
          ctx.clip();

          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          drawVideo();
          ctx.restore();


          drawing = requestAnimationFrame(draw);
        })();
      },
      function(err) {
        console.log("An error occured! " + err);
        alert("Oops! Some sort of error occured, refresh and try again.");
      }
  );
}

var centerCanvas = function(){
  var topHeight = (document.body.clientHeight - canvas.height)/2.0;
  if (topHeight > 0 ){
    $(canvas).css('top',topHeight + 'px');
  }

  var topWidth = (document.body.clientWidth - canvas.width)/2.0;
  $(canvas).css('left',topWidth + 'px');

}

var resizeCanvas = function(){
  canvas.width = document.body.clientWidth+1;
  if(canvas.width%2 == 1){canvas.width++;}
  canvas.height = document.body.clientHeight+1;
  if(canvas.height%2 == 1){canvas.height++;}
}

var drawVideo = function(){
  try {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    //    processImage();

  } catch (e) {
    if (e.name == "NS_ERROR_NOT_AVAILABLE") {
      setTimeout(drawVideo, 0);
    } else {
      throw e;
    }
  }
}

var processImage = function(){
  var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var pixData = pixels.data;
  for (i = 0; i < canvas.width; i++) {
    for (j = 0; j < canvas.height; j++) {
      //you can process individual pixels here
      var index = (j*canvas.width+i)*4
        if(maskData[index]==0){
          var r = pixData[index];
          var g = pixData[index+1];
          var b = pixData[index+2];
          var alpha = pixData[index+3];
        }
        else{
          pixData[index]=0;
          pixData[index+1]=0;
          pixData[index+2]=0;
          pixData[index+3]=0;

        }
    }
  }
  pixels.data = pixData;
  ctx.putImageData(pixels, 0, 0);
}

$(document).ready(function(){
  initCam();
});
