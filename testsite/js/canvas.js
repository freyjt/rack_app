
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


// Constructor
function CanvasApp(div_id) {
  var interval_ms = 100;
  this.ws = new WebSocket("ws://localhost:8889")
  var can = document.getElementById(div_id);
  this.h = parseInt(can.style.height);
  this.w = parseInt(can.style.width);
  can.height = this.h;
  can.width = this.w;
  this.d_l = []
  can.style.border = "2px solid blue";
  this.ctx = can.getContext('2d');
  for(i = 0; i < 10; i++) { 
    var rad = Math.floor(Math.random()*10) + 5;
    var pos = this.getRandPos();
    this.d_l.push(new Dot(pos, rad));
  }

  for(i = 0; i < 50; i++) {
    var rad = (Math.random() * 20) + 10;
    var pos = this.getRandPos();
    this.d_l.push(new DFlower(pos, rad, randomColor(), randomColor(), num_bet_mag_and_opp(10)));
    var rad = (Math.random() * 10) + 10;
    var pos = this.getRandPos();
    this.d_l.push(new Dot(pos, rad, randomColor()));
  }
  caller = this
  intId = setInterval(function() {
    caller.iterateView()
    caller.renderView();
  }, interval_ms);


//  this.renderView(this.d_l);
// Set us up the canvas
//  can.onclick = function(e) {
//    this.d_l = []
//    caller.renderView(this.d_l)
//    var v_req = { "Purpose": "Request View", "height": caller.h, "width": caller.w };
//    caller.ws.send(JSON.stringify(v_req));
//  }
//  this.ws.onmessage = function(e) {
//    console.log(e.data)
//    var objs = JSON.parse(e.data);
//    // Assumes objs is an array
//    for(var i in objs) {
//      var obj = objs[i]
//      var pos = obj.pos
//      var rad = obj.rad
//      var fill = obj.fill
//      if(obj.type == "Flower") { var shape = new Flower(pos, rad, fill) }
//      else{ var shape = new Dot(pos, rad, fill) }
//      this.d_l.push(shape);
//    }
//    caller.renderView(this.d_l);
//  }
}
CanvasApp.prototype.getRandPos = function() {
  return new Pos(Math.random() * this.w, Math.random() * this.h);
}
CanvasApp.prototype.renderView = function() {
  this.ctx.fillStyle = "#ffffff";
  this.ctx.fillRect(0, 0, this.w, this.h)
  for(var i in this.d_l) {
    this.d_l[i].draw(this.ctx)
  }
}
CanvasApp.prototype.iterateView = function() {
  for(var i in this.d_l) {
    if(typeof(this.d_l[i].update) == "function") this.d_l[i].update();
  }
}



function getRadians(degrees) {
  return (Math.PI * degrees) / 180;
}

function IntegerRad() {
   this.memo = []
   var p_over = Math.PI / 180
   for(var i = 0; i < 360; i++)
      this.memo.push(p_over * i)
}
IntegerRad.prototype.fromD = function(d) { 
  if(Number.isInteger(d))
    return this.memo[d % 360];
  else return (Math.PI / 180) * d
}

function randomColor() {
  var colors = ["blue", "green", "pink", "yellow", "orange", "red", "dark-red", "purple"]
  return colors[Math.floor(Math.random() * colors.length)]
}

function shapeSelector(pos, rad) {
  if(Math.random() < 0.7) { return new Dot(pos, rad, randomColor) }
  else { return new Flower(pos, rad) }
}

function num_bet_mag_and_opp(mag) {
  num = Math.ceil((Math.random() * mag) + 1)
  if(Math.random() < .5) num = num * -1;
  return num
}

function canvas_main() { new CanvasApp("canvas") }

