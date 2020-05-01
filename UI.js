// Various UI handlers + helpers
import { element } from "./DOMHelpers";

class UI {
  constructor({ server, player1, player2 }) {
    this.server = server;
    this.player1 = player1;
    this.player2 = player2;
  }

  updateNumberFromUI(old_value, element_id) {
    const input = element(element_id);
    const new_value = parseInt(input.value);
    if (isNaN(new_value)) {
      new_value = old_value;
    }
    input.value = new_value;
    return new_value;
  }

  updateParameters() {
    this.updatePlayerParameters(this.player1, "player1");
    this.updatePlayerParameters(this.player2, "player2");
    this.server.setUpdateRate(
      this.updateNumberFromUI(this.server.update_rate, "server_fps")
    );
    return true;
  }

  updatePlayerParameters(player, prefix) {
    player.lag = this.updateNumberFromUI(player.lag, prefix + "_lag");

    const cb_prediction = element(prefix + "_prediction");
    const cb_reconciliation = element(prefix + "_reconciliation");

    // Client Side Prediction disabled => disable Server Reconciliation.
    if (player.client_side_prediction && !cb_prediction.checked) {
      cb_reconciliation.checked = false;
    }

    // Server Reconciliation enabled => enable Client Side Prediction.
    if (!player.server_reconciliation && cb_reconciliation.checked) {
      cb_prediction.checked = true;
    }

    player.client_side_prediction = cb_prediction.checked;
    player.server_reconciliation = cb_reconciliation.checked;

    player.entity_interpolation = element(prefix + "_interpolation").checked;
  }
}

export default UI;
