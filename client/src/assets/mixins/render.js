export default {
  methods: {
    /**
     * Draw rectangle on canvas
     * @param rect {{pos: {x: number, y: number}, size: number, color: string}} rectangle data
     * @param rect.pos {Object} position of rectangle
     * @param rect.pos.x {Number} rectangle's position on the x-axis
     * @param rect.pos.y {Number} rectangle's position on the y-axis
     * @param rect.size {Number|Object} size of rectangle; if number this is a square size
     * @param [rect.size.width] {Number} width of rectangle
     * @param [rect.size.height] {Number} height of rectangle
     * @param rect.color {String} color of rectangle
     * @param [rect.border] {String} color of border
     * @param [rect.dashed] {Boolean} if passed border will be dashed
     */
    renderRectangle(rect) {
      if (typeof rect.pos !== 'object') {
        return;
      }

      this.context.save();
      this.context.fillStyle = rect.color;
      this.context.fillRect(
        rect.pos.x,
        rect.pos.y,
        typeof rect.size === 'object' ? rect.size.width : rect.size,
        typeof rect.size === 'object' ? rect.size.height : rect.size,
      );

      if (rect.border) {
        this.context.strokeStyle = rect.border;

        if (rect.dashed) {
          this.context.setLineDash([6]);
        }

        this.context.strokeRect(
          rect.pos.x,
          rect.pos.y,
          typeof rect.size === 'object' ? rect.size.width : rect.size,
          typeof rect.size === 'object' ? rect.size.height : rect.size,
        );
      }

      this.context.restore();
    },

    /**
     * Draw line on canvas
     * @param line {Object} line data
     * @param line.from {Object} line start coordinates
     * @param line.from.x {Number} line start coordinate x-axis
     * @param line.from.y {Number} line start coordinate y-axis
     * @param line.to {Object} line end coordinates
     * @param line.to.x {Number} line end coordinate x-axis
     * @param line.to.y {Number} line end coordinate y-axis
     * @param line.color {String} line color
     */
    renderLine(line) {
      this.context.beginPath();
      this.context.moveTo(line.from.x, line.from.y);
      this.context.lineTo(line.to.x, line.to.y);
      this.context.strokeStyle = line.color;
      this.context.stroke();
    },

    /**
     * Draw circle on canvas
     * @param circle {Object} circle data
     * @param circle.color {String} circle color
     * @param circle.pos {Object} circle position
     * @param circle.pos.x {Number} circle coordinate x-axis
     * @param circle.pos.y {Number} circle coordinate y-axis
     * @param circle.size {Number} circle size
     */
    renderCircle(circle) {
      this.context.save();

      this.context.fillStyle = circle.color;
      this.context.beginPath();
      this.context.arc(circle.pos.x, circle.pos.y, circle.size, 0, 2 * Math.PI);
      this.context.fill();

      this.context.restore();
    },
  }
}
