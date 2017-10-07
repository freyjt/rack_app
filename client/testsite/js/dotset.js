function DotList(minSize, maxSize, sizePos) {
  this.minSize = minSize
  this.maxSize = maxSize
  this.colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
  this.list = []
  this.width = sizePos.x
  this.height = sizePos.y
}
DotList.prototype.at = function(index) {
  try {
    return this.list[index];
  } catch(e) {
    console.log("Unable to return dot from DotList");
    return null;
  }
}
DotList.prototype.genRand = function(count) {
  for(var i = 0; i < count; i++) this.addOneRand()
}
DotList.prototype.addOneRand = function() {
  var pos = Pos.newRand(this.width, this.height);
  var colo = this.colors[Math.floor(Math.random() * this.colors.length)]
  var size = this.randSize();
  this.list.push(new Dot(pos, size, colo));
}
DotList.prototype.draw = function(ctx) {
  for(i in this.list) {
    try {
      this.list[i].draw(ctx);
    } catch(e) {
      console.log("I Can't draw: " + this.list[i]);
    }
  }
}
// @todo If you're going to do this. You might as well return an iterator
DotList.prototype.len = function() {
  return this.list.length;
}
DotList.prototype.empty = function() {
  return this.list.length == 0;
}
DotList.prototype.randSize = function() {
  return Math.floor(Math.random() * (this.maxSize - this.minSize)) + this.minSize;
}
DotList.prototype.removeIndex = function(i) {
  try {
    console.log( "removing index: " + i);
    this.list.splice(i, 1);
  //todo, stop catchin e everywhere.
  } catch(e) {
    console.log("Attempted to remove a value that we couldn't")
  }
} 
