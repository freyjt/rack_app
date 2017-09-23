
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
  caller.iterateView();
  caller.renderView();
  intId = setInterval(function() {
    caller.iterateView()
    caller.renderView();
  }, interval_ms);
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
