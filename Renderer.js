// =============================================================================
//  The Renderer
// =============================================================================

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
  }

  // Render everything
  renderWorld(entities) {
    // Clear the canvas.
    this.canvas.width = this.canvas.width;

    var colours = ["blue", "red"];

    for (var i in entities) {
      var entity = entities[i];

      // Compute size and position.
      var radius = (this.canvas.height * 0.9) / 2;
      var x = (entity.x / 10.0) * this.canvas.width;

      // Draw the entity.
      var ctx = this.canvas.getContext("2d");
      ctx.beginPath();
      ctx.arc(x, this.canvas.height / 2, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = colours[entity.entity_id];
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "dark" + colours[entity.entity_id];
      ctx.stroke();
    }
  }
}

export default Renderer;
