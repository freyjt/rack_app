#\ -w -p 8282 -E production
use Rack::Reloader, 0
use Rack::Static, :urls => ["/testsite"]

require 'faye/websocket'
Faye::WebSocket.load_adapter('thin')

COLORS = ['red', 'blue', 'green', 'yellow', 'orange']

class MyApp

  def generate_response(data)
    COLORS.sample
  end

  def call(env)
    if Faye::WebSocket.websocket?(env)
      ws = Faye::WebSocket.new(env)
      ws.on :message do |event|
        ws.send generate_response(event.data)
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
