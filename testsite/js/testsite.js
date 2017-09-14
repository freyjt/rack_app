function get_connection() {
  return new WebSocket("ws://localhost:8888")
  
}

function wait_for_readystate(ws) {
  console.log("Checking Readystate: " + ws.get_ready_state())
  setTimeout( function() {
    if(ws.get_ready_state() === 1) return;
    else wait_for_readystate(ws);
  }, 5)
}

function destroy_(object) {
  object == null
}

function WSClickHandler(click_e, caller) {
  // Websocket may not be ready by the time we call this
  this.send = function(data) {
    this.ws.send(data)
  }
  this.get_ready_state = function() { return this.ws.readyState }
  // This only works if we have a callback
  this.wait_for_readystate = function() {
    console.log("Checking Readystate: " + this.ws.readyState)
    setTimeout( function() {
      if(this.ws.readyState === 1) {
        console.log("Websocket ready")
        return;
      }
      else this.wait_for_readystate();
    }, 5)
  }
  //constructor
  this.ws = get_connection();
  this.wait_for_readystate();

  console.log(this.ws);
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
    console.log("Ready state " + ws.get_ready_state())
    wait_for_readystate(ws);
    console.log("After Ready State: " + ws.get_ready_state())
    ws.send("Here's a message " + this.style.backgroundColor);
  }
}


window.onload = function() { main(); }
