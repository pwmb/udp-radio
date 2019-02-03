const radio = require('../src/radio')

let Radio = new radio("192.168.0.255", 9090, function(msg, info){

})

Radio.broadcast({"hello":"world,"})