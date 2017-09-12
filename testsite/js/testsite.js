

function main() {
  var click = document.getElementById('click')
  var ws = new WebSocket("ws://localhost:8282")

  click.onclick = function(e) {
    ws.send("Here's a message " + this.style.background)
    console.log("Click Registered " + this.style.background);
    if(this.style.background.split(' ')[0] === 'green') this.style.background = 'blue';
    else this.style.background = 'green';

  }
  ws.onmessage = function(e) {
    console.log(e.data)
    click.style.background = e.data
  }
}


window.onload = function() { main(); }
