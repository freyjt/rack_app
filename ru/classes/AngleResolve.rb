

module AngleResolve

  # try to remember that this will resolve Y to be negative.
  # @TODO reminder that max_dist must be server controlled
  def self.whereToGo(pos, requested_pos, max_dist) 
    delta_y = requested_pos[:y] - pos[:y]
    delta_x = pos[:x] - requested_pos[:x]
    angle = Math.atan2(delta_y, delta_x)
    dist = Math.sqrt(delta_y**2 + delta_x**2)
    return requested_pos if(max_dist > dist)
     return { :x => Math.cos(angle) * max_dist,
              :y => Math.sin(angle) * max_dist  }
  end

end
