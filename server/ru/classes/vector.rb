
# This contains the code to describe various 2 dimensional traits such as
#  * velocity
#  * position
#  * acceleration
# You know, a vector
class Vector
  attr_accessor :x, :y

  def initialize(x, y)
    @x = x || 0
    @y = y || 0
  end

  def add_vector(invector)
    @x = @x + invector.x
    @y = @y + invector.y
  end

  def add_dims(x, y)
    add_vector Vector.new(x, y)
  end

end

