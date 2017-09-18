#\ -w -E production
use Rack::Reloader, 0

# Serves static files, someday separate this logic
use Rack::Static, :urls => ["/testsite"]

require 'json'
require 'faye/websocket'
Faye::WebSocket.load_adapter('thin')

COLORS = ['red', 'blue', 'green', 'yellow', 'orange']

class MyApp

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

  def call(env)
    if Faye::WebSocket.websocket?(env)
      ws = Faye::WebSocket.new(env)
      ws.on :open do |event|
        puts "New websocket connection"
      end
      ws.on :message do |event|
        puts event.data
        dat = JSON.parse event.data
        ws.send JSON.generate(generate_shapes(dat["height"], dat["width"], 299))
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
