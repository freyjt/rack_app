require_relative 'spec_helper.rb' 

describe Vector, '#initialize' do

  it "sets two integer parameters" do
    x = 5
    y = 20
    my_vec = Vector.new(x, y)
    expect(my_vec.x).to eq x
    expect(my_vec.y).to eq y
  end

  it "sets two float parameters" do
    x = 5.9
    y = 38.2
    my_vec = Vector.new(x, y)
    expect(my_vec.x).to eq x
    expect(my_vec.y).to eq y
  end

end

describe Vector, "#add_dims" do

  it "adds to integers to two integers" do
    init_x = 5
    add_x = 5
    init_y = 3
    add_y = 4

    my_vec = Vector.new(init_x, init_y)
    my_vec.add_dims(add_x, add_y)
    expect(my_vec.x).to eq(init_x + add_x)
    expect(my_vec.y).to eq(init_y + add_y)

  end

  it "adds two float to two integers" do
    init_x = 5
    init_y = 3
    float_x = 0.5
    float_y = 9.1
    sum_x = 5.5  # intentionally manual because I am avoiding assumptions about background additions
    sum_y = 12.1 #  -- Test Driving to find out what happens --
    init_vec = Vector.new(init_x, init_y)
    init_vec.add_dims(float_x, float_y)
    expect(init_vec.x).to eq sum_x
    expect(init_vec.y).to eq sum_y
  end

end

describe Vector, "#add_vector" do

  it "adds another vector" do
     init_x = 3
     init_y = 5
     other_x = 4
     other_y = 29
     my_vec = Vector.new(init_x, init_y)
     ot_vec = Vector.new(other_x, other_y)
     my_vec.add_vector(ot_vec)
     expect(my_vec.x).to eq(init_x + other_x)
     expect(my_vec.y).to eq(init_y + other_y)
  end

  it "adds itself" do
    init_x = 3
    init_y = 5
    init_vec = Vector.new(init_x, init_y)
    init_vec.add_vector(init_vec)
    expect(init_vec.x).to eq(init_x * 2)
    expect(init_vec.y).to eq(init_y * 2)
  end

end

describe Vector, "#magnitude" do

   it "returns 5 for a 3-4 vector" do
     init_x = 3
     init_y = 4
     expected_mag = 5
     init_vec = Vector.new(init_x, init_y)
     expect(init_vec.magnitude).to eq(expected_mag)
   end

   it "changes when x changes" do
     init_x = 5
     init_y = 3
     delta_x = 1

     init_vec = Vector.new(init_x, init_y)
     init_mag = init_vec.magnitude
     init_vec.add_dims(delta_x, 0)
     expect(init_vec.magnitude).not_to eq(init_mag)
   end

   it "changes when y changes" do
     init_x = 5
     init_y = 3
     delta_y = 1

     init_vec = Vector.new(init_x, init_y)
     init_mag = init_vec.magnitude
     init_vec.add_dims(0, delta_y)
     expect(init_vec.magnitude).not_to eq(init_mag)
   end

   it "returns 5 for a neg3-4 vector" do
     init_x = 4
     init_y = -3.0
     exp_mag = 5
     init_vec = Vector.new(init_x, init_y)
     expect(init_vec.magnitude).to eq(exp_mag)
   end

end

describe Vector, "#angle" do
  it "returns a number for a vector" do
    init_x = 3
    init_y = 5
    my_vec = Vector.new(init_x, init_y)
    expect(my_vec.angle).to be_a(Numeric)
  end

  it "returns 0 for a 0 vector" do
    init_x = 0
    init_y = 0
    my_vec = Vector.new(init_x, init_y)
    expect(my_vec.angle).to eq(0)
  end

  it "returns 0 for a 1-0 vector" do
    init_x = 1
    init_y = 0
    my_vec = Vector.new(init_x, init_y)
    expect(my_vec.angle).to eq(0)
  end

  it "returns pi for a -1-0 vector" do
    init_x = -1
    init_y = 0
    my_vec = Vector.new(init_x, init_y)
    expect(my_vec.angle).to eq(Math::PI)
  end

end
