

function Dot(loc, rad, fillStyle) {  
  this.pos = loc
  this.rad = rad
  if(fillStyle != null { this.fillStyle = fillStyle }

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
  for(var i = 0; i < 6; i++) { circs.push((ng * i)*(Math.PI / 180)) }
  var dots = []
  for(var i = 0; i < 6; i++) { 
    new Dot(this.resolvePos(circs[i]), this.rad).draw(ctx)
  }

}
Flower.prototype.toString = function() {
  return "Position x: " + this.pos.x + " Position y: " + this.pos.y  + " Radius: " + this.rad
}

// Constructor
function CanvasApp(div_id) {
  var can = document.getElementById(div_id);
  var h = parseInt(can.style.height);
  var w = parseInt(can.style.width);
  can.height = h;
  can.width = w;
  var d_l = []
  for(i = 0; i < 10; i++) { 
    var rad = Math.floor(Math.random()*10) + 5;
    var pos = this.getRandPos(h, w);
    d_l.push(new Dot(pos, rad));
  }
  can.style.border = "2px solid blue";
  var ctx = can.getContext('2d');
  for(var i in d_l) {
    d_l[i].draw(ctx);
  } 
  console.log(d_l);
  flower = new Flower(this.getRandPos(h, w), 15);
  console.log(flower.toString())
  flower.draw(ctx)
 
}
CanvasApp.prototype.getRandPos = function(h, w) {
  return { x: Math.random() * h, y: Math.random() * w };
}


function canvas_main() {
  new CanvasApp("canvas")


}
