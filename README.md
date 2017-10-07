# udp-radio
UDP based broadcasting and receiving module, It expects an JS Object and returns the same on the otherside


## Instalation
```
$ npm install upd-radio
```


## Usages

#### Requiring the package
```
const Radio = require('udp-radio');
```

#### Async receiving any broadcast
```
let radio = new Radio(BROADCAST_ADDR, BROADCAST_PORT, (message, info)=>{
    // on receiving of a radio broadcast
    console.log(message)
})
```

#### Async send any broadcast
```
const message = {
  _type: "LOGOUT",
  _content: os.hostname()
}
radio.broadcast(message)
```
