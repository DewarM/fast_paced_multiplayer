class KeyHandler {
  constructor({ player1, player2 }) {
    this.player1 = player1;
    this.player2 = player2;
  }

  attach() {
    document.body.onkeydown = this.keyHandler.bind(this);
    document.body.onkeyup = this.keyHandler.bind(this);
  }

  // When the player presses the arrow keys, set the corresponding flag in the client.
  keyHandler(e) {
    e = e || window.event;
    if (e.keyCode == 39) {
      this.player1.key_right = e.type == "keydown";
    } else if (e.keyCode == 37) {
      this.player1.key_left = e.type == "keydown";
    } else if (e.key == "d") {
      this.player2.key_right = e.type == "keydown";
    } else if (e.key == "a") {
      this.player2.key_left = e.type == "keydown";
    } else {
      console.log(e);
    }
  }
}

export default KeyHandler;
