
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
