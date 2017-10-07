
module AngleResolve

  # try to remember that this will resolve Y to be negative.
  # @TODO reminder that max_dist and pos must be server controlled
  def self.whereToGo(pos, requested_pos, max_dist) 
    begin
      delta_y = requested_pos[:y] - pos[:y]
      delta_x = pos[:x] - requested_pos[:x]
      angle = Math.atan2(delta_y, delta_x)
      dist = Math.sqrt(delta_y**2 + delta_x**2)
      return requested_pos if(max_dist > dist)
      return { :x => pos[:x] - Math.cos(angle) * max_dist,
               :y => pos[:y] + Math.sin(angle) * max_dist  }
    rescue Exception => e
      puts e
      return requested_pos
    end
  end

end
