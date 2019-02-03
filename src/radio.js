const dgram = require('dgram');
const os = require('os');

const Radio = function(broadcastAddress, broadcastPort, onReceive) {
  this.sender     = dgram.createSocket("udp4");
  this.receiver   = dgram.createSocket("udp4");
  this.port       = broadcastPort;
  this.addr       = broadcastAddress;
  this.networkInterfacesCacheSet = new Array()

  this.networkInterfacesCacheRefresh()

  this.receiver.bind(this.port)
  this.receiver.on('error', (err) => {
    console.error("[Radio Receiver Error] : Something went wrong!\n" + err);
    this.receiver.close();
  });
  this.receiver.on('message', (msg, rinfo) => {
    if (this.networkInterfacesCacheSet.includes(rinfo.address) || (this.sender.address().address == rinfo.address && this.sender.address().port == rinfo.port)) {
      // second or condition is only there for fallback
      // ignore self broadcast
      return;
    }
    try {
      msg = JSON.parse(msg.toString());
    } catch (e) {
      console.error("[Radio Message Parsing Error] : Unable to parse to JSON\n", + e);
    } finally {
      if (onReceive) {
        onReceive(msg, rinfo);
      }
    }
  })

  this.sender.bind(function() {
    this.setBroadcast(true);
  })
}

Radio.prototype.networkInterfacesCacheRefresh = function(){
  const networkInterfaces = os.networkInterfaces();
  Object.keys(networkInterfaces).forEach(category => {
    networkInterfaces[category].forEach(network => {
      if (false == this.networkInterfacesCacheSet.includes(network.address)) {
        this.networkInterfacesCacheSet.push(network.address);
      }
    });
  });
}

Radio.prototype.broadcast = function(message){
  if (typeof(message) === 'object') {
    // convert the object to buffer
    const buffer = new Buffer.from(JSON.stringify(message))
    this.sender.send(buffer, this.port, this.addr, (error, success)=>{
      if (error != null) {
        console.error("[Radio Broadcast Error] : Something went wrong!\n" + error)
      }
    })
  }else{
    throw new Error("EXPECTED_JS_OBJECT_BROADCAST_ERROR")
  }
}

module.exports = Radio;