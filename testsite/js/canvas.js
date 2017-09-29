var avatar = {
  dotsKilled: 0,
  speed: 6
}

// Constructor
function CanvasApp(div_id) {
  var interval_ms = 100;
  var ws_url = document.getElementById("hostName").innerHTML
  this.ws = new WebSocket(ws_url)
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
  this.viewCounter = 0;
  this.dotList = new DotList(10, 20, this.sizePos)
  this.dotList.genRand(20);

  caller = this
  caller.iterateView();
  caller.renderView();
  intId = setInterval(function() {
    caller.iterateView();
    caller.renderView();
  }, interval_ms)

  can.onmouseup = function(e) {
    caller.lastClick = getXY(e, this);
  }
  this.position = {} 

  // The internet says all execution is atomic....
  // Ideally this will stack up as we get more data in.
  //   (but not necessarily) 
  //   We could frame these with a timestamp, but we'd have to
  //    sort on the timestamp everytime we wanted to use it
  //
  //    do js objs eat memory with additional keys? no. So key by timestamp?
  //    
  this.ws.onmessage = function(data) {
    var obj = JSON.parse(data);
    if(obj.why === "location")
      this.position[Date.now()] = obj.what.posNow;
    else
      console.log("I don't know what's wrong");
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
  this.viewCounter += 1; // @TODO this is a little hackey for sync. You can do better.
  hitCheckAvatar(this.avatar, this.dotList);
  try {
     if(this.lastClick != null) {
       this.avatar.addUpdate( requestMove(this.lastClick, this.viewCounter, this.ws) );
     }
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

// @TODO define how many to preserve
// @TODO move this and all other positions to an avatar object.
// @TODO doesn't seem like this should be the fastest way, does it?
CanvasApp.prototype.cleanPosition = function() {
  if(this.position.keys.length < 5) return;
  key_arr = this.position.keys
  first_half = key_arr.slice(0, Math.floor(key_arr.length / 2));
  for(var i in first_half) {
    this.positions.keys.delete first_half[i]
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
function requestMove(chasePos, viewCounter, ws) {
  return function(caller) {
    // @TODO we should not tell the server what our position is. We should let the server track that.
    try {
    var message = { "why": "location",
                    "requestNumber": viewCounter,
                    "what": { "posNow": caller.pos,
                              "posLater": chasePos }
                  }
    ws.send(JSON.stringify(message));
    } catch(e) {
      console.log("I got an exception in request move. Here it is:")
      console.log(e);
    }
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
     if(hitCheckTwo(av_pos, av_rad, other.pos, other.rad)) {
       list.removeIndex(i);
     }
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

