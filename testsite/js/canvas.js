

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


function Flower(loc, rad) {
  this.pos = loc
  this.rad = rad
}
// is angle in rads or degrees?
Flower.prototype.resolvePos = function(angle) {
  //(negative) change y = hyp * sin(theta)
  //(positive) change x = hyp * cos(theta)
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
  var can = document.getElementById(div_id);
  this.h = parseInt(can.style.height);
  this.w = parseInt(can.style.width);
  can.height = this.h;
  can.width = this.w;
  var d_l = []
  can.style.border = "2px solid blue";
  this.ctx = can.getContext('2d');
  for(i = 0; i < 10; i++) { 
    var rad = Math.floor(Math.random()*10) + 5;
    var pos = this.getRandPos();
    d_l.push(new Dot(pos, rad));
  }

  for(i = 0; i < 10000; i++) {
    var rad = (Math.random() * 10) + 10;
    var pos = this.getRandPos();
    d_l.push(shapeSelector(pos, rad));
  }
  for(var i in d_l) {
    d_l[i].draw(this.ctx);
  } 
}
CanvasApp.prototype.getRandPos = function() {
  return { x: Math.random() * this.w, y: Math.random() * this.h };
}
CanvasApp.prototype.renderView = function(drawables) {
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, this.w, this.h)
  for(var i in drawables) {
    drawables[i].draw()
  }
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

