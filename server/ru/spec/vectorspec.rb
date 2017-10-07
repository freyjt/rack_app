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
  it "adds itself" do
    init_x = 3
    init_y = 5

    init_vec = Vector.new(init_x, init_y)

    init_vec.add_vector(init_vec)
    expect(init_vec.x).to eq(init_x * 2)
    expect(init_vec.y).to eq(init_y * 2)

  end

end
