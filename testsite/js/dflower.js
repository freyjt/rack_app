// spinning flower ...that's what update means
// @TODO better names for properties
function DFlower(loc, rad, petal_f, stamen_f, spin) {
  this.dot = new Dot(loc, rad / 4, stamen_f);
  this.loc = loc
  this.d_len = rad;
  this.d_d = rad / 4;
  this.d_w = rad / 2;
  this.d__l = (3*this.d_len)/4;
  this.rot = 45;
  this.petal_f = petal_f
  this.spin = spin
  if(typeof(this.spin) != "number") this.spin = 0;
  this.total_spin = 0.0;
  this.formPetals();
}
DFlower.prototype.draw = function(ctx) {
  this.dot.draw(ctx)
  for(var i in this.petals) {
    this.petals[i].draw(ctx);
  }
}
DFlower.prototype.update = function( ) {
  this.total_spin = this.total_spin + this.spin
  this.formPetals()
}
DFlower.prototype.formPetals = function() {
  this.petals = [];
  for(var i = 0; i < (360 / this.rot); i++) {
    this.petals.push(new Diamond(this.loc, this.d_d, this.d_len, this.d_w, this.d__l, getRadians((this.rot * i) + this.total_spin), this.petal_f))
  } 
}
