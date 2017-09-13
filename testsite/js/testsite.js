

function main() {
  var click = document.getElementById('click')
  var ws = new WebSocket("ws://localhost:8282")

  click.onclick = function(e) {
    bg_col = this.style.backgroundColor
    ws.send("Here's a message " + bg_col);
    console.log("Click Registered " + bg_col);
    if(bg_col === 'green') bg_col = 'blue';
    else bg_col = 'green';

  }
  ws.onmessage = function(e) {
    console.log(e.data)
    click.style.backgroundColor = e.data
  }
}


window.onload = function() { main(); }
