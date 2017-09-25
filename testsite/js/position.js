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


Pos.newRand = function(width, height) {
  return new Pos(Math.floor(Math.random() * width), Math.floor(Math.random() * height))
}
