import LagNetwork from "./LagNetwork";
import Renderer from "./Renderer";
import Entity from "./Entity";

// =============================================================================
//  The Server.
// =============================================================================

class Server {
  constructor(canvas, status) {
    // Connected clients and their entities.
    this.clients = [];
    this.entities = [];

    // Last processed input for each client.
    this.last_processed_input = {};

    // Simulated network connection.
    this.network = new LagNetwork();

    // UI.
    this.renderer = new Renderer(canvas);
    this.status = status;

    // Default update rate.
    this.setUpdateRate(10);
  }

  connect(client) {
    // Give the Client enough data to identify itself.
    client.server = this;
    client.entity_id = this.clients.length;
    this.clients.push(client);

    // Create a new Entity for this Client.
    var entity = new Entity();
    this.entities.push(entity);
    entity.entity_id = client.entity_id;

    // Set the initial state of the Entity (e.g. spawn point)
    var spawn_points = [4, 6];
    entity.x = spawn_points[client.entity_id];
  }

  setUpdateRate(hz) {
    this.update_rate = hz;

    clearInterval(this.update_interval);
    this.update_interval = setInterval(
      (function (self) {
        return function () {
          self.update();
        };
      })(this),
      1000 / this.update_rate
    );
  }

  update() {
    this.processInputs();
    this.sendWorldState();
    this.renderer.renderWorld(this.entities);
  }

  validateInput(input) {
    if (Math.abs(input.press_time) > 1 / 40) {
      return false;
    }
    return true;
  }

  // Check whether this input seems to be valid (e.g. "make sense" according
  // to the physical rules of the World)
  processInputs() {
    // Process all pending messages from clients.
    while (true) {
      var message = this.network.receive();
      if (!message) {
        break;
      }

      // Update the state of the entity, based on its input.
      // We just ignore inputs that don't look valid; this is what prevents clients from cheating.
      if (this.validateInput(message)) {
        var id = message.entity_id;
        this.entities[id].applyInput(message);
        this.last_processed_input[id] = message.input_sequence_number;
      }
    }

    // Show some info.
    var info = "Last acknowledged input: ";
    for (var i = 0; i < this.clients.length; ++i) {
      info +=
        "Player " + i + ": #" + (this.last_processed_input[i] || 0) + "   ";
    }
    this.status.textContent = info;
  }

  // Send the world state to all the connected clients.
  sendWorldState() {
    // Gather the state of the world. In a real app, state could be filtered to avoid leaking data
    // (e.g. position of invisible enemies).
    var world_state = [];
    var num_clients = this.clients.length;
    for (var i = 0; i < num_clients; i++) {
      var entity = this.entities[i];
      world_state.push({
        entity_id: entity.entity_id,
        position: entity.x,
        last_processed_input: this.last_processed_input[i],
      });
    }

    // Broadcast the state to all the clients.
    for (var i = 0; i < num_clients; i++) {
      var client = this.clients[i];
      client.network.send(client.lag, world_state);
    }
  }
}

export default Server;
