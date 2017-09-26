// spinning flower ...that's what update means
// @TODO better names for properties
function DFlower(pos, rad, petal_f, stamen_f, spin) {
  this.pos = pos;
  this.rad = rad;
  this.d_len = this.rad;
  this.d_d = this.rad / 4;
  this.d_w = this.rad / 2;
  this.d__l = (3*this.d_len)/4;
  this.rot = 45;
  this.stamen_f = stamen_f;
  this.petal_f = petal_f
  this.spin = spin
  if(typeof(this.spin) != "number") this.spin = 0;
  this.totalSpin = 0.0;
  this.form();
  this.updates = []
  for(var i in flowerMix) {
    if(flowerMix.hasOwnProperty(i))
      this[i] = flowerMix[i];
  }
}
DFlower.prototype.form = function() {
  this.components = [];
  for(var i = 0; i < (360 / this.rot); i++) {
    this.components.push(new Diamond(this.pos, this.d_d, this.d_len, this.d_w, this.d__l, getRadians((this.rot * i) + this.totalSpin), this.petal_f))
  } 
  this.components.push(new Dot(this.pos, this.rad / 4, this.stamen_f));
}
DFlower.prototype.addUpdate = function(updateCallback) {
  this.updates.push(updateCallback);
}
