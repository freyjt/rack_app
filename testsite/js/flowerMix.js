var flowerMix = {
  // @TODO rename dots and whateves to components
  draw: function(ctx) {
      try {
        for(var i in this.components) {
          this.components[i].draw(ctx);
        }
      } catch(e) {
        console.log("I was unable to draw this shape. Was components defined?")
        console.log(e);
      }
    },
  // @TODO put all spins in updates .. maybe, should a thing know how it spins?
  update: function() { 
      try {
        for(var i in this.updates) { this.updates[i](this); }
      } catch(e) {
        console.log("I was unable to update, are you sure these are all functions?");
        console.log(e);
      }
      this.updates = [];
      this.form();
    },
  addUpdate: function(updateCallback) { this.updates.push(updateCallback); }
}
