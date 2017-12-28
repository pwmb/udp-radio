const dgram = require('dgram');

class Radio {
  constructor(broadcast_address, broadcast_port, onReceive) {
    this.sender     = dgram.createSocket("udp4")
    this.receiver   = dgram.createSocket("udp4")
    this.port       = broadcast_port
    this.addr       = broadcast_address

    this.receiver.bind(this.port)
    this.receiver.on('error', (err) => {
      console.error(`[Radio Receiver Error] : Something went wrong!\n${err}`)
      this.receiver.close()
    })
    this.receiver.on('message', (msg, rinfo) => {
      if (this.sender.address().address == rinfo.address && this.sender.address().port == rinfo.port) {
        // ignore self broadcast
        return
      }
      try {
        msg = JSON.parse(msg.toString())
      } catch (e) {
        console.error(`[Radio Message Parsing Error] : Unable to parse to JSON\n${e}`)
      } finally {
        onReceive(msg, rinfo)
      }
    })

    this.sender.bind(function() {
      this.setBroadcast(true)
    })
  }
  broadcast(message){
    if (typeof(message) === 'object') {
      // convert the object to buffer
      const buffer = new Buffer.from(JSON.stringify(message))
      this.sender.send(buffer, this.port, this.addr, (error, success)=>{
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
