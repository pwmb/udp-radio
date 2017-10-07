const dgram = require('dgram');

class Radio {
  constructor(broadcast_address, broadcast_port, onReceive) {
    this.receiver = dgram.createSocket("udp4")
    this.sender   = dgram.createSocket("udp4")
    this.port     = broadcast_port
    this.addr     = broadcast_address

    this.sender.bind(this.port)
    this.sender.on('error', (err) => {
      console.error(`[Radio Receiver Error] : Something went wrong!\n${err}`)
      this.sender.close()
    })
    this.sender.on('message', (msg, rinfo) => {
      try {
        msg = JSON.parse(msg.toString())
      } catch (e) {
        console.error(`[Radio Message Parsing Error] : Unable to parse to JSON\n${e}`)
      } finally {
        onReceive(msg, rinfo)
      }
    })

    this.receiver.bind(function() {
      this.setBroadcast(true)
    })
  }
  broadcast(message){
    if (typeof(message) === 'object') {
      // convert the object to buffer
      const buffer = new Buffer.from(JSON.stringify(message))
      this.receiver.send(buffer, this.port, this.addr, (error, success)=>{
        if (error != null) {
          console.error(`[Radio Broadcast Error] : Something went wrong!\n${error}`)
        }
      })
    }else{
      throw new Error("EXPECTED_JS_OBJECT_BROADCAST_ERROR")
    }
  }
}


module.exports = Radio;
