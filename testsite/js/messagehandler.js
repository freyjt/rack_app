function messageHandler(message, caller) {
  console.log(message);
  var message_obj = JSON.parse(message.data);
  if(message_obj.why === "location")
    caller.position[Date.now()] = message_obj.what;
  else
    console.log("I don't know what to do with this " + message_obj);
}
