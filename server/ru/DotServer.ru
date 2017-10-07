#\ -w -E production
use Rack::Reloader, 0

# Serves static files, someday separate this logic
use Rack::Static, :urls => ["/testsite"]

require 'json'
require 'faye/websocket'
require_relative 'classes/AngleResolve.rb'
Faye::WebSocket.load_adapter('thin')

COLORS = ['red', 'blue', 'green', 'yellow', 'orange']

class MyApp
   include AngleResolve

  def random_color()
    COLORS.sample
  end

  def random_pos(h, w)
    return { :x => rand * w, :y => rand * h }
  end

  def generate_shapes(h, w, count)
    shapes = []
    (0..(count - 1)).each do 
      shapes << { :pos =>  random_pos(h, w),
                  :fill => random_color(),
                  :rad => (rand() * 10 + 5),
                  :type => (rand() < 0.5) ? "Flower" : "Dot" }
      
    end
    return shapes
  end

  def get_location(data)
    puts data
    my_pos = data[:posNow]
    req_pos = data[:posLater]
    max_dist = 10; # @TODO resolve this with an object that tracks the avatar.
    AngleResolve.whereToGo(my_pos, req_pos, max_dist)
  end

  def call(env)
    if Faye::WebSocket.websocket?(env)
      ws = Faye::WebSocket.new(env)
      ws.on :open do |event|
        puts "New websocket connection"
      end
      ws.on :message do |event|
        data = JSON.parse(event.data, :symbolize_names => true)
        if(data[:why] == "location") 
          new_location = get_location data[:what]
          wire_object = JSON.generate( { :why => "location", :what => new_location } )
          ws.send wire_object
        end
      end
      ws.on :close do |event|
        puts "Socket closed"
        ws = nil
      end
      ws.rack_response
    else
      [200, {'Content-Type' => 'text/plain'}, ["hello cruel world"] ]
    end
  end

end

run MyApp.new
