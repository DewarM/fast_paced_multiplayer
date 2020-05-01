// =============================================================================
//  An Entity in the world.
// =============================================================================

class Entity {
  constructor() {
    this.x = 0;
    this.speed = 2; // units/s
    this.position_buffer = [];
  }

  applyInput(input) {
    this.x += input.press_time * this.speed;
  }
}

export default Entity;
