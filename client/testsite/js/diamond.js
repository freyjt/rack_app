
// We can memo length too, but idk if that makes sense just yet
// @NOTE This isn't premature. Excuses aside, we were getting some lag on the runs,
//   ideally this makes it better?
function Trig( ) {
  this.sin = []
  this.cos = [] 
  for(var i = 0; i < 360; i++) {
    this.sin.push(Math.sin(i));
    this.cos.push(Math.cos(i));
  }
}
Trig.prototype.sin = function(d) {
  if(Number.isInteger(d))
    return this.sin[d % 360];
  else
    return Math.sin(d);
}
Trig.prototype.cos = function(d) {
  if(Number.isInteger(d))
    return this.cos[d % 360];
  else
    return Math.cos(d);
}


// start_pos is given to be the point one of the diamond, which all other measurements will be taken agianst
// start_pos and rot need to coincide, @TODO make this not true rot ^ dist implies start
function Diamond(pos, start_dist, len, wid, len_to_w, rot, fillStyle) {
  var half_wid = wid / 2;
  var wing_theta = Math.atan(half_wid / len_to_w)
  var wing_hyp = Math.cos(wing_theta) * len_to_w
  if(typeof(rot) != "number") { rot = 0 }
  start_vec = new Pos( (Math.cos(rot) * start_dist), -(Math.sin(rot) * start_dist));
  this.points = []
  t_n = 0;                h_n = 0;        this.points.push(pos_closure().add(start_vec).add(pos))
  t_n = rot - wing_theta; h_n = wing_hyp; this.points.push(pos_closure().add(start_vec).add(pos))
  t_n = rot;              h_n = len;      this.points.push(pos_closure().add(start_vec).add(pos))
  t_n = rot + wing_theta; h_n = wing_hyp; this.points.push(pos_closure().add(start_vec).add(pos))

  if(fillStyle != null) this.fillStyle = fillStyle;
  if(typeof(fillStyle) == "function") this.fillStyle = fillStyle();

  function pos_closure() {
    return new Pos( Math.cos(t_n) * h_n, -(Math.sin(t_n) * h_n))
  }
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

