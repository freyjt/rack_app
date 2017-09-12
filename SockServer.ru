#\ -w -p 8282 -E production
use Rack::Reloader, 0

require 'faye/websocket'
Faye::WebSocket.load_adapter('thin')

class MyApp
  COLORS = ['red', 'blue', 'green', 'yellow', 'orange']

  def call(env)
    if Faye::WebSocket.websocket?(env)
      ws = Faye::WebSocket.new(env)
      ws.on :message do |event|
        puts "DATA: #{event.data}"
        ws.send(COLORS.sample)
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
