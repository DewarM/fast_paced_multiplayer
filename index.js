import Client from "./Client";
import Server from "./Server";
import UI from "./UI";
import KeyHandler from "./KeyHandler";
import { element } from "./DOMHelpers";

// =============================================================================
//  Get everything up and running.
// =============================================================================

// Setup a server, the player's client, and another player.
const server = new Server(element("server_canvas"), element("server_status"));
const player1 = new Client(
  element("player1_canvas"),
  element("player1_status")
);
const player2 = new Client(
  element("player2_canvas"),
  element("player2_status")
);

// Setup the keyhandler
new KeyHandler({ player1, player2 }).attach();

// Connect the clients to the server.
server.connect(player1);
server.connect(player2);

const ui = new UI({ server, player1, player2 });

// For access from index.html
window._ui = ui;

// Read initial parameters from the UI.
ui.updateParameters();
