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
  this.total_spin = 0.0;
  this.form();
  this.updates = []
}
DFlower.prototype.draw = function(ctx) {
  this.dot.draw(ctx)
  for(var i in this.petals) {
    this.petals[i].draw(ctx);
  }
}
DFlower.prototype.update = function( ) {
  this.total_spin = this.total_spin + this.spin
  this.form()
  // Call all updates, then discard
  for(var i = 0; i < this.updates.length; i++) this.updates[i](this);
  this.updates = []
}
DFlower.prototype.form = function() {
  this.dot = new Dot(this.pos, this.rad / 4, this.stamen_f);
  this.petals = [];
  for(var i = 0; i < (360 / this.rot); i++) {
    this.petals.push(new Diamond(this.pos, this.d_d, this.d_len, this.d_w, this.d__l, getRadians((this.rot * i) + this.total_spin), this.petal_f))
  } 
  this.dot = new Dot(this.pos, this.rad / 4, this.stamen_f);
}
DFlower.prototype.addUpdate = function(updateCallback) {
  this.updates.push(updateCallback);
}
