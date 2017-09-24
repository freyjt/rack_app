// Constructor
function CanvasApp(div_id) {
  var interval_ms = 100;
  this.ws = new WebSocket("ws://localhost:8889")
  var can = document.getElementById(div_id);
  this.h = parseInt(can.style.height);
  this.w = parseInt(can.style.width);
  can.height = this.h;
  can.width = this.w;
  this.d_l = []
  can.style.border = "2px solid blue";
  this.ctx = can.getContext('2d');

  for(i = 0; i < 1; i++) {
    var rad = (Math.random() * 20) + 10;
    var pos = this.getRandPos();
    this.d_l.push(new DFlower(pos, rad, randomColor(), randomColor(), num_bet_mag_and_opp(10)));
  }
  caller = this
  caller.iterateView();
  caller.renderView();
  intId = setInterval(function() {
    caller.iterateView()
    caller.renderView();
  }, interval_ms);
}
CanvasApp.prototype.getRandPos = function() {
  return new Pos(Math.random() * this.w, Math.random() * this.h);
}
CanvasApp.prototype.renderView = function() {
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, this.w, this.h)
  for(var i in this.d_l) {
    this.d_l[i].draw(this.ctx)
  }
}
CanvasApp.prototype.iterateView = function() {
  for(var i in this.d_l) {
    if(typeof(this.d_l[i].update) == "function") this.d_l[i].update();
  }

  var x_y = 
  
}


function getRadians(degrees) {
  return (Math.PI * degrees) / 180;
}

function randomColor() {
  var colors = ["blue", "green", "pink", "yellow", "orange", "red", "dark-red", "purple"]
  return colors[Math.floor(Math.random() * colors.length)]
}

function shapeSelector(pos, rad) {
  if(Math.random() < 0.7) { return new Dot(pos, rad, randomColor) }
  else { return new Flower(pos, rad) }
}

function num_bet_mag_and_opp(mag) {
  num = Math.ceil((Math.random() * mag) + 1)
  if(Math.random() < .5) num = num * -1;
  return num
}

// Assume that the object in question has a 'pos' property
//  maxDist would be nice to be metho
function chasesPoint(chasePos, moveDist) {
  // update this.pos on the caller object
  return function() {
    // point angle
    p_theta = Math.atan2(this.pos.x - chasePos.x, this.pos.y - chasePos.y);
    new_x = this.pos.x + (Math.cos(p_theta) * moveDist)
    new_y = this.pos.y - (Math.sin(p_theta) * moveDist)
    this.pos = new Pos(new_x, new_y)
  }
}

// thank you to
//http://www.chestysoft.com/imagefile/javascript/get-coordinates.asp
getXY = function(e, eCaller) {

    function findPosition(oElement) {
        if(typeof( oElement.offsetParent ) != "undefined") {
            for(var X = 0, Y = 0; oElement; oElement = oElement.offsetParent) {
                X += oElement.offsetLeft;
                Y += oElement.offsetTop;
            }
            return [ X, Y ];
        }
        else { //THIS IS NOT RIGHT, just fills the whole damn thing with bad..
                //maybe the author meant left and top?..offsets?
            return [ oElement.x, oElement.y ];
        }
    }   
    
    var posX = 0;
    var posY = 0;
    var imgPos;

    imgPos = findPosition(eCaller);
    if (!e) var e = window.event;
    if (e.pageX || e.pageY) {
        posX = e.pageX;
        posY = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        posX = e.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
        posY = e.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
    }
    posX = posX - imgPos[0];
    posY = posY - imgPos[1];
    return {x: posX, y: posY };
}
// end cited material


function canvas_main() { new CanvasApp("canvas") }
