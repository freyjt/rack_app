// x,y vector with math and builder pattern
function Pos(x, y) {
  this.x = x;
  this.y = y;
}
Pos.prototype.add = function(pos) {
  this.x = this.x + pos.x;
  this.y = this.y + pos.y;
  return this;
}




function Dot(loc, rad, fillStyle) {  
  this.pos = loc
  this.rad = rad
  if(fillStyle != null) { this.fillStyle = fillStyle }
  if(typeof(fillStyle) === "function") { this.fillStyle = fillStyle(); }

}
Dot.prototype.draw = function(ctx) {
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.rad, 0, 2*Math.PI);
  if(this.fillStyle != null) {
    ctx.fillStyle = this.fillStyle
    ctx.fill()
  }
  ctx.stroke();
}


// start_pos is given to be the point one of the diamond, which all other measurements will be taken agianst
// start_pos and rot need to coincide, @TODO make this not true rot ^ dist implies start
function Diamond(pos, start_dist, len, wid, len_to_w, rot) {
  var half_wid = wid / 2;
  var wing_theta = Math.atan(half_wid / len_to_w)
  var wing_hyp = Math.cos(wing_theta) * len_to_w
  if(typeof(rot) != "number") { rot = 0 }
  start_vec = new Pos( (Math.cos(rot) * start_dist), -(Math.sin(rot) * start_dist));
  this.points = []
  t_n = 0;                h_n = 0;        this.points.push(pos_closure().add(start_vec).add(pos))
  t_n = rot - wing_theta; h_n = wing_hyp; this.points.push(pos_closure().add(start_vec).add(pos))
  t_n = rot;              h_n = len;      this.points.push(pos_closure().add(start_vec).add(pos))
  t_n = rot + wing_theta; h_n = wing_hyp; this.points.push(pos_closure().add(start_vec).add(pos))

  function pos_closure() {
    return new Pos( Math.cos(t_n) * h_n, -(Math.sin(t_n) * h_n))
  }
}
Diamond.prototype.draw = function(ctx) {
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  f_p = this.points[0];
  ctx.moveTo(f_p.x, f_p.y);
  for(var i in this.points) {
    f_p = this.points[i];
    ctx.lineTo(f_p.x, f_p.y);
  }
  ctx.closePath();
  ctx.stroke();
}

Math.prototype.rad_from_d(d) = function {
  return (d * Math.PI) / 180;

}

function DFlower(loc, rad, stamen_f, petal_f, spin) {
  this.rad = rad;
  this.loc = loc;
  this.stamen_f = stamen_f;
  this.petal_f = petal_f;
  this.spin = spin;
  this.d_len = rad;
  this.d_d = rad / 4;
  this.d_w = rad / 2;
  this.d__l = (3*d_len)/4;
  this.rot = 45;

  this.genPetals();
  this.genDot();
}
DFlower.setLoc = function(loc) {
  this.loc = loc;
  this.genDot();
  this.genPetals();
}
DFlower.prototype.setSpin = function(spin) {
  this.spin = spin;
}
DFlower.prototype.update = function() {
  this.spin_sum += this.spin
  this.genPetals();
}
DFlower.prototype.genDot = function() {
  this.dot = new Dot(this.loc, this.rad / 4, this.stamen_f)
}
DFlower.prototype.genPetals = function() {
  this.petals = [];
  for(var i = 0; i < (360 / rot); i++) {
    // @TODO if diamonds can spin, we don't need new
    this.petals.push(new Diamond(this.loc, this.d_d, this.d_len, this.d_w, this.d__l, Math.rad_from_d( (this.rot * i) + this.spin_sum) ))
  }
}
DFlower.prototype.pointIn = function(pos) {
  d = Math.sqrt(Math.pow(pos.x - this.loc.x, 2) + Math.pow(pos.y - this.loc.y))
  if(d < this.rad) return true
  return false
}
DFlower.prototype.draw = function(ctx) {
  for(var i in this.bits) {
    this.bits[i].draw(ctx);
  }
}


function Flower(loc, rad) {
  this.pos = loc
  this.rad = rad
}
//theta is given in rads
Flower.prototype.resolvePos = function(angle) {
  y_st = this.pos.y
  x_st = this.pos.x
  var rad = this.rad 
  y_new = y_st - (rad * Math.sin(angle))
  x_new = x_st + (rad * Math.cos(angle))
  return {x: x_new, y: y_new}
}
Flower.prototype.draw = function(ctx) {
  // lets start by just drawing 6 circles
  var ng = 60;
  var circs = []
  for(var i = 1; i < 6; i += 2) { circs.push((ng * i)*(Math.PI / 180)) }
  ng = 120
  for(var i = 0; i < 3; i++) { circs.push((ng * i)*(Math.PI / 180)) }
  var dots = []
  for(var i = 0; i < 6; i++) { new Dot(this.resolvePos(circs[i]), this.rad, "white").draw(ctx) }
  new Dot(this.pos, this.rad - 1, "yellow").draw(ctx)
}
Flower.prototype.toString = function() {
  return "Position x: " + this.pos.x + " Position y: " + this.pos.y  + " Radius: " + this.rad
}

// Constructor
function CanvasApp(div_id) {
  this.ws = new WebSocket("ws://localhost:8889")
  var can = document.getElementById(div_id);
  this.h = parseInt(can.style.height);
  this.w = parseInt(can.style.width);
  can.height = this.h;
  can.width = this.w;
  var d_l = []
  can.style.border = "2px solid blue";
  this.ctx = can.getContext('2d');
  // Set us up the canvas
  caller = this
  var dFlower = new DFlower({x: 100, y: 100}, 25, "blue", "light-blue", 0);
  this.renderView([dFlower]);
  var intID = null;
  can.onmousemove(e) {
   var xy = getXY(e, this);
   if(dFlower.pointIn(xy))
     intId = setInterval(function() { dFlower.update(); this.renderView([dFlower]); }, 60);
   else
     clearInterval(intId);
  }


}
CanvasApp.prototype.getRandPos = function() {
  return new Pos(Math.random() * this.w, Math.random() * this.h);
}
CanvasApp.prototype.renderView = function(drawables) {
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, this.w, this.h)
  for(var i in drawables) {
    drawables[i].draw(this.ctx)
  }
}


function d_to_rad(d) {
  return (Math.PI / 180) * d;
}

function randomColor() {
  var colors = ["blue", "yellow", "green", "orange", "red"]
  return colors[Math.floor(Math.random() * colors.length)]
}

function shapeSelector(pos, rad) {
  if(Math.random() < 0.7) { return new Dot(pos, rad, randomColor) }
  else { return new Flower(pos, rad) }
}

function canvas_main() { new CanvasApp("canvas") }


// thank you to
// //http://www.chestysoft.com/imagefile/javascript/get-coordinates.asp
function getXY(event, element) {
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

  imgPos = findPosition(element);
  if (!event) var event = window.event;
  if (event.pageX || event.pageY) {
     posX = event.pageX;
     posY = event.pageY;
  }
  else if (event.clientX || event.clientY) {
    posX = event.clientX + document.body.scrollLeft
      + document.documentElement.scrollLeft;
    posY = event.clientY + document.body.scrollTop
      + document.documentElement.scrollTop;
  }
  posX = posX - imgPos[0];
  posY = posY - imgPos[1];
  return {x: posX, y: posY };
}
// end cited material

