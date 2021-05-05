require 'json'
require 'uri'
require 'net/http'

samples = %w[
  #1100ff #0066aa #cc33cc #0022dd
  #0066ee #bbbb11 #5566dd #55eeaa
  #ee7700 #33bbaa #44aa77 #dd6699
  #99ee22 #ff22aa #99aa11 #dd1122
]

uri = URI('https://raw.githubusercontent.com/hsluv/hsluv/master/snapshots/snapshot-rev4.json')
latest = Net::HTTP.get(uri)

data = JSON.load(latest)
output = File.open('test/data/_snapshot.scss', 'w')

output.puts '$values: ('

samples.each do |color|
  values = data[color]

  hsluv = values['hsluv']
  hpluv = values['hpluv']
  lch   = values['lch']
  luv   = values['luv']
  xyz   = values['xyz']
  rgb   = values['rgb']

  output.puts <<-EOF
  '#{color}': (
    'hsluv': (
      'h': #{hsluv[0]}deg,
      's': #{hsluv[1]},
      'l': #{hsluv[2]}
    ),
    'hpluv': (
      'h': #{hpluv[0]}deg,
      's': #{hpluv[1]},
      'l': #{hpluv[2]}
    ),
    'lch': (
      'l': #{lch[0]},
      'c': #{lch[1]},
      'h': #{lch[2]}deg
    ),
    'luv': (
      'l': #{luv[0]},
      'u': #{luv[1]},
      'v': #{luv[2]}
    ),
    'xyz': (
      'x': #{xyz[0]},
      'y': #{xyz[1]},
      'z': #{xyz[2]}
    ),
    'rgb': (
      'r': #{rgb[0] * 255},
      'g': #{rgb[1] * 255},
      'b': #{rgb[2] * 255}
    )
  )#{',' unless color == samples.last}
  EOF
end

output.puts ');'
output.close
