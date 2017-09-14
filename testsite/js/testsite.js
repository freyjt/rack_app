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
    destroy_(this)
  }
}

function main() {
  var click = document.getElementById('click')
//  var ws = get_connection()
  var ws = null

  click.onclick = function(e) {
    if(ws === null) ws = new WSClickHandler(e, this)
    else(console.log("Websocket already active"))
    ws.send("Here's a message " + this.style.backgroundColor);
//    console.log("Click Registered " + bg_col);
//    if(bg_col === 'green') bg_col = 'blue';
//    else bg_col = 'green';

  }
//   ws.onmessage = function(e) {
//     console.log(e.data)
//     click.style.backgroundColor = e.data
//   }
// 
//   //does not reset the connection
//   ws.onclose  = function(e) {
//     ws = get_connection()
//   }
}


window.onload = function() { main(); }
