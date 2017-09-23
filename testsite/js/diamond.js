
// We can memo length too, but idk if that makes sense just yet
// @NOTE This isn't premature. Excuses aside, we were getting some lag on the runs,
//   ideally this makes it better?
// Say....dumbass...why are you going with 360.... these functions work on radians....
function Trig( ) {
  this.sin_memo = []
  this.cos_memo = [] 
  for(var i = 0; i < 360; i++) {
    this.sin_memo.push(Math.sin(Trig.radsFromDegs(i)));
    this.cos_memo.push(Math.cos(Trig.radsFromDegs(i)));
  }
}
Trig.prototype.sin = function(d) {
  if(Number.isInteger(d)) {
    return this.sin_memo[d % 360];
  }
  else
    return Math.sin(Trig.radsFromDegs(d));
}
Trig.prototype.cos = function(d) {
  if(Number.isInteger(d)) {
    return this.cos_memo[d % 360];
  }
  else
    return Math.cos(Trig.radsFromDegs(d));
}
Trig.radsFromDegs = function(degree) { return (Math.PI * degree) / 180; }
Trig.degsFromRads = function(rads) { return (rads * 180) / Math.PI; }

// start_pos is given to be the point one of the diamond, which all other measurements will be taken agianst
// start_pos and rot need to coincide, @TODO make this not true rot ^ dist implies start
function Diamond(pos, start_dist, len, wid, len_to_w, rot, fillStyle) {
  var half_wid = wid / 2;
  var wing_theta = Math.round(Trig.degsFromRads(Math.atan(half_wid / len_to_w))); // we should round this so we can take advantage of the memo
  console.log( " WING THETA: " + wing_theta ) 
  var wing_hyp = Diamond.trig.cos(wing_theta) * len_to_w
  if(typeof(rot) != "number") { rot = 0 }
  rot = Trig.degsFromRads(rot);
  start_vec = new Pos( (Diamond.trig.cos(rot) * start_dist), -(Diamond.trig.sin(rot) * start_dist));

  this.points = []
  t_n = 0;                h_n = 0;        this.points.push(this.pos(t_n, h_n).add(start_vec).add(pos))
  t_n = rot - wing_theta; h_n = wing_hyp; this.points.push(this.pos(t_n, h_n).add(start_vec).add(pos))
  t_n = rot;              h_n = len;      this.points.push(this.pos(t_n, h_n).add(start_vec).add(pos))
  t_n = rot + wing_theta; h_n = wing_hyp; this.points.push(this.pos(t_n, h_n).add(start_vec).add(pos))

  if(fillStyle != null) this.fillStyle = fillStyle;
  if(typeof(fillStyle) == "function") this.fillStyle = fillStyle();
}
// @TODO Trig should just be static forcing it to be static here means we need to re-init for every object that it is useful for
Diamond.trig = new Trig();
Diamond.prototype.pos = function(theta, hyp) {
  return new Pos( Diamond.trig.cos(theta) * hyp, -(Diamond.trig.sin(theta) * hyp));
}
Diamond.prototype.draw = function(ctx) {
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = this.fillStyle;
  ctx.beginPath();
  f_p = this.points[0];
  ctx.moveTo(f_p.x, f_p.y);
  for(var i in this.points) {
    f_p = this.points[i];
    ctx.lineTo(f_p.x, f_p.y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

