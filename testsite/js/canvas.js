

function Dot(loc, rad) {  
  this.pos = loc
  this.rad = rad

}
Dot.prototype.draw = function(ctx) {
  ctx.strokeStyle = "#000000";
  ctx.stroke();

}

// Constructor
function CanvasApp(div_id) {
  can = document.getElementById(div_id);
  var h = parseInt(can.style.height);
  var w = parseInt(can.style.width);
  var d_l = []
  for(i = 0; i < 10; i++) { 
    var rad = Math.floor(Math.random()*10) + 5;
    var pos = { x: Math.random() * h, y: Math.random() * w };
    d_l.push(new Dot(pos, rad));
  }
  can.style.border = "2px solid blue";
  var ctx = can.getContext('2d');

}


function canvas_main() {
  new CanvasApp("canvas")


}
