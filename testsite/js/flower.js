
function Flower(pos, rad, petal_f, stamen_f, spin) {
  this.pos = pos 
  this.rad = rad
  this.stamen_f = stamen_f
  this.petal_f = petal_f
  this.components = [];
  this.spin = typeof(spin) == "number" ? spin : 0;
  this.totalSpin = 0;
  this.updates = [];
  for(var i in flowerMix) {
    if(flowerMix.hasOwnProperty(i))
      this[i] = flowerMix[i];
  }
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

// @TODO this can be cleaner
Flower.prototype.form = function() {
  //remember to add stamen last
  // lets start by just drawing 6 circles
  var ng = 60;
  var circs = [];
  for(var i = 1; i < 6; i += 2) { circs.push((ng * i + this.totalSpin)*(Math.PI / 180)) }
  ng = 120;
  for(var i = 0; i < 3; i++) { circs.push((ng * i + this.totalSpin)*(Math.PI / 180)) }
  var dots = []
  this.components = []
  for(var i = 0; i < 6; i++) { 
    this.components.push(new Dot(this.resolvePos(circs[i]), this.rad, "white")) 
  }
  this.components.push(new Dot(this.pos, this.rad - 1, this.stamen_f))
}

Flower.prototype.toString = function() {
  return "Position x: " + this.pos.x + " Position y: " + this.pos.y  + " Radius: " + this.rad
}
