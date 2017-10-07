
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
