
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




// start_pos is given to be the point one of the diamond, which all other measurements will be taken agianst
// start_pos and rot need to coincide, @TODO make this not true rot ^ dist implies start
function Diamond(pos, start_dist, len, wid, len_to_w, rot) {
  var half_wid = wid / 2;
  var wing_theta = Math.atan(half_wid / len_to_w)
  var wing_hyp = Math.cos(wing_theta) * len_to_w
  //this doesn't have to be a property
  if(typeof(rot) != "number") { rot = 0 }
  start_vec = new Pos( Math.cos(rot) * start_dist, -(Math.sin(rot) * start_dist));
  this.points = []
  // First calc all things from zero, then transpose by adding the start pos to each
  //   @TODO Shouldn't something be negative here?
  t_n = 0;                h_n = 0;        this.points.push(pos_closure().add(start_vec).add(pos))
  t_n = rot - wing_theta; h_n = wing_hyp; this.points.push(pos_closure().add(start_vec).add(pos))
  t_n = rot;              h_n = len;      this.points.push(pos_closure().add(start_vec).add(pos))
  t_n = rot + wing_theta; h_n = wing_hyp; this.points.push(pos_closure().add(start_vec).add(pos))

  function pos_closure() {
    return new Pos( Math.cos(t_n) * h_n, -(Math.sin(t_n) * h_n))
  }
}
Diamond.prototype.draw = function(ctx) {
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  f_p = this.points[0];
  ctx.moveTo(f_p.x, f_p.y);
  for(var i in this.points) {
    f_p = this.points[i];
    ctx.lineTo(f_p.x, f_p.y)
  }
  ctx.closePath();
  ctx.stroke();
}

function DFlower(loc, rad) {
  this.bits = [];
  this.bits.push(new Dot(loc, rad / 4, "purple"));
  var d_len = rad;
  var d_d = rad / 4;
  var d_w = rad / 2;
  var d__l = (3*d_len)/4;
  var rot = 45;
  
  for(var i = 0; i < (360 / rot); i++) {
    this.bits.push(new Diamond(loc, d_d, d_len, d_w, d__l, rot * i))
  } 
}
DFlower.prototype.draw = function(ctx) {
  for(var i in this.bits) {
    this.bits[i].draw(ctx);
  }
}


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

// Constructor
function CanvasApp(div_id) {
  this.ws = new WebSocket("ws://localhost:8889")
  var can = document.getElementById(div_id);
  this.h = parseInt(can.style.height);
  this.w = parseInt(can.style.width);
  can.height = this.h;
  can.width = this.w;
  var d_l = []
  can.style.border = "2px solid blue";
  this.ctx = can.getContext('2d');
  for(i = 0; i < 10; i++) { 
    var rad = Math.floor(Math.random()*10) + 5;
    var pos = this.getRandPos();
    d_l.push(new Dot(pos, rad));
  }

  for(i = 0; i < 10; i++) {
    var rad = (Math.random() * 10) + 10;
    var pos = this.getRandPos();
    d_l.push(new DFlower(pos, rad));
  //  d_l.push(shapeSelector(pos, rad));
  }
  this.renderView(d_l);
  // Set us up the canvas
  caller = this
  can.onclick = function(e) {
    d_l = []
    caller.renderView(d_l)
    var v_req = { "Purpose": "Request View", "height": caller.h, "width": caller.w };
    caller.ws.send(JSON.stringify(v_req));
  }
  this.ws.onmessage = function(e) {
    console.log(e.data)
    var objs = JSON.parse(e.data);
    // Assumes objs is an array
    for(var i in objs) {
      var obj = objs[i]
      var pos = obj.pos
      var rad = obj.rad
      var fill = obj.fill
      if(obj.type == "Flower") { var shape = new Flower(pos, rad, fill) }
      else{ var shape = new Dot(pos, rad, fill) }
      d_l.push(shape);
    }
    caller.renderView(d_l);
  }
}
CanvasApp.prototype.getRandPos = function() {
  return new Pos(Math.random() * this.w, Math.random() * this.h);
}
CanvasApp.prototype.renderView = function(drawables) {
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, this.w, this.h)
  for(var i in drawables) {
    drawables[i].draw(this.ctx)
  }
}

function randomColor() {
  var colors = ["blue", "yellow", "green", "orange", "red"]
  return colors[Math.floor(Math.random() * colors.length)]
}

function shapeSelector(pos, rad) {
  if(Math.random() < 0.7) { return new Dot(pos, rad, randomColor) }
  else { return new Flower(pos, rad) }
}

function canvas_main() { new CanvasApp("canvas") }

