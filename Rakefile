task :default => :build

desc "build javascript"
task :build do
  puts 'Building Javascript.'
  ['jquery-socialButtons'].each do |file|
    system "uglifyjs %s.js > %s.min.js" % [file, file]
  end
end
