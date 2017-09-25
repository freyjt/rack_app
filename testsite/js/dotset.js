function DotSet(minSize, maxSize, sizePos) {
  this.minSize = minSize
  this.maxSize = maxSize
  this.colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
  this.list = []
  this.width = sizePos.x
  this.height = sizePos.y
}
DotSet.prototype.genRand(count) {
  for(var i = 0; i < count; i++) this.addOneRand()
}
DotSet.prototype.addOneRand = function() {
  var pos = Pos.newRand(this.width, this.height);
  var colo = this.colors[Math.floor(Math.random() * this.colors.length)]
  var size = this.randSize();
}
DotSet.prototype.randSize = function() {
  return Math.floor(Math.random * (this.maxSize - this.minSize)) + this.minSize;
}
DotSet.prototype.removeIndex = function(i) {
  try {
    this.list.splice(i, 1);
  //todo, stop catchin e everywhere.
  } catch(e) {
    console.log("Attempted to remove a value that we couldn't")
  }
} 
