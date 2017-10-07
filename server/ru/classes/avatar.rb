

class Avatar
  attr_reader :position
  def initialize(pos=nil)
    @position = pos || {:x => 0, :y => 0}
  end
end
