var CONNECT_URL = "ws://localhost:8888"


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
  this.get_connection = function() {
    return new WebSocket(CONNECT_URL)
  }
  // Websocket may not be ready by the time we call this
  this.send = function(data) {
    this.ws.send(data)
  }
  this.get_ready_state = function() { return this.ws.readyState }
  // This only works if we have a callback
  ths = this
  this.wait_for_readystate = function(callback) {
    console.log("Checking Readystate: " + this.ws.readyState)
    setTimeout( function() {
      if(ths.ws.readyState === 1) {
        console.log("Websocket ready")
        console.log(callback);
        callback();
        return;
      }
      else ths.wait_for_readystate(callback);
    }, 5)
  }
  //constructor
  this.ws = this.get_connection();
  this.wait_for_readystate( function() { ths.send("Connection made") } );

  this.changer = caller
  this.ws.onmessage = function(ws_e) {
    console.log(ws_e.data);
    ths.changer.style.backgroundColor = ws_e
  }
  this.ws.onclose = function(ws_e) {
    console.log("Lost Websocket Connection")
    destroy_(this)
  }
}


function click_main() {
  var click = document.getElementById('click')
  var ws = null

  click.onclick = function(e) {
    if(ws === null) ws = new WSClickHandler(e, this)
    else(console.log("Websocket already active"))
    console.log("Ready state " + ws.get_ready_state())
    bg_color = this.style.backgroundColor
    ws.wait_for_readystate(function() {ws.send("Here's a message " + bg_color)});
    console.log("After Ready State: " + ws.get_ready_state())
  }
}

