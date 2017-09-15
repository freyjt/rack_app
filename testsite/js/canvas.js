

function Dot(loc, rad) {
  

}


// Constructor
function CanvasApp(div_id) {
  can = document.getElementById(div_id);
  var h = parseInt(can.style.height);
  var w = parseInt(can.style.width);
  var d_l = []
  for(i = 0; i < 10; i++) { 
    var rad = Math.floor(Math.random()*10) + 5
    var pos = { x: Math.random() * h, y: Math.random() * w }
    d_l.push(new Dot(pos, rad))
  }
  can.style.border = "2px solid blue"
  

}


function canvas_main() {
  new CanvasApp("canvas")


}
