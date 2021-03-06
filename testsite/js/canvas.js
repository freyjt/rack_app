// Constructor
function CanvasApp(div_id) {
  var interval_ms = 100;
  this.ws = new WebSocket("ws://localhost:8889")
  var can = document.getElementById(div_id);
  this.h = parseInt(can.style.height);
  this.w = parseInt(can.style.width);
  this.sizePos = new Pos(this.w, this.h);
  can.height = this.h;
  can.width = this.w;
  this.avatar = []
  can.style.border = "2px solid blue";
  this.ctx = can.getContext('2d');
  //starting pos of avatar
  var pos = this.getRandPos();
  var rad = 20
  this.avatar = new DFlower(pos, rad, randomColor(), randomColor(), 10);
  this.lastClick = pos; // Hacky this sets the thing to move to its own pos
  
  this.dotList = new DotList(10, 20, this.sizePos)
  this.dotList.genRand(20);

  caller = this
  caller.iterateView();
  caller.renderView();
  intId = setInterval(function() {
    caller.iterateView();
    caller.renderView();
  }, interval_ms);

  can.onmouseup = function(e) {
    caller.lastClick = getXY(e, this);
  }
}
CanvasApp.prototype.getRandPos = function() {
  return new Pos(Math.random() * this.w, Math.random() * this.h);
}
CanvasApp.prototype.renderView = function() {
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, this.w, this.h)
  this.avatar.draw(this.ctx);
  this.dotList.draw(this.ctx);
}
CanvasApp.prototype.setLastClick = function(clickPos) {
  this.lastClick = clickPos;
}
CanvasApp.prototype.iterateView = function() {
  hitCheckAvatar(this.avatar, this.dotList);
  try {
     if(this.lastClick != null) this.avatar.addUpdate( chasePoint(this.lastClick, 5) );
     this.avatar.addUpdate( spinFunction(5) );
  } catch(e) {
    console.log("I could not add a callback")
  }
  try {
    this.avatar.update();
  } catch(e) {
    console.log("I could not update this thing");
    console.log(e);
  }
  if(this.dotList.empty()) {
     this.dotList.genRand(20);
  }
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

function magnitudeNumber(mag) {
  num = Math.ceil((Math.random() * mag) + 1)
  return num
}

// Assume that the object in question has a 'pos' property
//  maxDist would be nice to be metho
function chasePoint(chasePos, moveDist) {
  return function(caller) {
    p_theta = Math.atan2(caller.pos.y - chasePos.y, chasePos.x - caller.pos.x);
    distance = Math.sqrt(Math.pow(caller.pos.x - chasePos.x, 2) + Math.pow(caller.pos.y - chasePos.y, 2))
    if(distance < moveDist) {
      new_x = chasePos.x;
      new_y = chasePos.y;
    } else {
      new_x = caller.pos.x + (Math.cos(p_theta) * moveDist)
      new_y = caller.pos.y - (Math.sin(p_theta) * moveDist)
    } 
    caller.pos = new Pos(new_x, new_y)
  }
}
function spinFunction(iterationSpin) {
  return function(caller) {
    try {
      caller.totalSpin = (caller.totalSpin + iterationSpin) % 360;
    } catch(e) {
      console.log("Couldn't spin it brah, check the 'cept");
      console.log(e);
    }
  }
}

// we assume both are round
function hitCheckAvatar(avatar, list) {
   av_pos = avatar.pos
   av_rad = avatar.rad

   for(var i = list.len() - 1; i >= 0; i--) {
     var other = list.at(i);
     // we make a hefty assumption about what the list returns.
     if(hitCheckTwo(av_pos, av_rad, other.pos, other.rad))
       list.removeIndex(i);
   }
}
function hitCheckTwo(firstPos, firstRad, secondPos, secondRad) {
   var totalDist = firstRad + secondRad;
   var yDist = secondPos.y - firstPos.y;
   var xDist = firstPos.x - secondPos.x;
   return Math.sqrt(Math.pow(yDist, 2) + Math.pow(xDist, 2)) < totalDist
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
