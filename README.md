# udp-radio
UDP based broadcasting and receiving module, It expects an JS Object and returns the same on the otherside


## Instalation
```bash
$ npm install upd-radio
```


## Usages

#### Requiring the package
```js
const Radio = require('udp-radio');
```

#### Async receiving any broadcast
```js
let channel_0 = new Radio(BROADCAST_ADDR, BROADCAST_PORT, (message, info)=>{
    // on receiving of a radio broadcast
    console.log(message);
})
```

#### Async send any broadcast
```js
const message = {
  _type: "LOGOUT",
  _content: os.hostname();
}
channel_0.broadcast(message);
channel_0.close();
```
