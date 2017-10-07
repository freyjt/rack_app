require_relative 'spec_helper.rb'

describe Avatar, '#position' do
  context 'initial construcion' do
    context 'with parameters' do
      it 'is set to the parameters' do
         position_object = { :x => 3, :y => 5 }
         my_avatart = Avatar.new(position_object)
         expect(my_avatart.position).to eq position_object
      end
    end

    context 'without parameters' do
      it 'is set to default of 0,0' do
        default_position = { :x => 0, :y => 0}
        my_avatart = Avatar.new( )
        expect(my_avatart.position).to eq default_position
      end
    end
  end
end


