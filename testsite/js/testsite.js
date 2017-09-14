function get_connection() {
  return new WebSocket("ws://localhost:8282")
}

function destroy_(object) {
  object == null
}

function WSClickHandler(click_e, caller) {
  this.ws = get_connection();
  console.log(this.ws);
  this.send = function(data) {
    this.ws.send(data)
  }
  this.ws.onmessage = function(ws_e) {
    console.log(ws_e.data);
    caller.style.backgroundColor = ws_e.data
  }
  this.ws.onclose = function(ws_e) {
    console.log("Lost Websocket Connection")
    destroy_(this)
  }
}

function main() {
  var click = document.getElementById('click')
  var ws = null

  click.onclick = function(e) {
    if(ws === null) ws = new WSClickHandler(e, this)
    else(console.log("Websocket already active"))
    ws.send("Here's a message " + this.style.backgroundColor);
  }
}


window.onload = function() { main(); }
