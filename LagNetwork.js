// =============================================================================
//  A message queue with simulated network lag.
// =============================================================================

class LagNetwork {
  constructor() {
    this.messages = [];
  }

  // "Send" a message. Store each message with the timestamp when it should be
  // received, to simulate lag.
  send(lag_ms, message) {
    this.messages.push({ recv_ts: +new Date() + lag_ms, payload: message });
  }

  // Returns a "received" message, or undefined if there are no messages available
  // yet.
  receive() {
    var now = +new Date();
    for (var i = 0; i < this.messages.length; i++) {
      var message = this.messages[i];
      if (message.recv_ts <= now) {
        this.messages.splice(i, 1);
        return message.payload;
      }
    }
  }
}
export default LagNetwork;
