var canvas = $('#selfie')[0];
var ctx = canvas.getContext('2d');
var video  = document.createElement('video');
video.id="video";

var mask_img = new Image();
mask_img.src = "img/FaceMapMask.png";
var mask = document.createElement('canvas');
var maskPixels= ctx.getImageData(0, 0, mask.width, mask.height);
var maskData = maskPixels.data;
var points = [];

var drawn = 0;
var clipped = 0;


var w = canvas.width/2;
var h = canvas.height/2;

/*
points.push([w + 100, h]);
points.push([w, h + 100]);
points.push([w - 100, h ]);
points.push([w , h - 100]);
points.push([w +100 , h]);
*/

/*
$("body").keydown(function(e){
  if(e.keyCode == 39){
    console.log("bigger")
    var t = $("#draggable").css("transform") + 0.1;
    $("#draggable").css("transform", t);
  }
  if(e.keyCode == 37){
    console.log("smaller")
    var t = $("#draggable").css("transform") - 0.1;
    $("#draggable").css("transform", t);

  }
});
*/

$( "#draggable" ).draggable();

$('#selfie').mousedown(function(e){
  var x = e.pageX - this.offsetLeft;
  var y = e.pageY - this.offsetTop;
  console.log(x + ',' + y);
  points.push([x,y]);
});

var distance = function(x,y){
  return Math.sqrt(Math.pow((x[1]-y[1]),2) + Math.pow(x[0]-y[0],2));
}

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


         if(drawn){

           if(!clipped){
             console.log('clipping');
           ctx.rect(0,0,canvas.width,canvas.height);
           ctx.fillStyle="black";
           ctx.fill();
           ctx.beginPath();
           points.forEach(function(p){
             ctx.lineTo(p[0],p[1]);
           });
           ctx.closePath();
           ctx.fill();
           ctx.clip();
           clipped = 1;
           }
         }



          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          drawVideo();
          ctx.restore();

          if(!drawn){
            if(points.length>4){

              if(distance(points[0], points[points.length-1])<20){
                drawn = "true";

              }

            }
            points.forEach(function(p){
              ctx.beginPath();
              ctx.arc(p[0], p[1], 10, 0, 2 * Math.PI, false);
              ctx.fillStyle = 'blue';
              ctx.fill();
            });
          }



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
