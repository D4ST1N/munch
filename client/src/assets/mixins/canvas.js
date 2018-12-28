export default {
  data() {
    return {
      canvas: null,
      context: null,
      lastTime: performance.now(),
      gameTick: 0,
      fps: 60,
      raf: null,
      entities: [],
      started: false,
    };
  },

  methods: {
    init(entities, size) {
      this.canvas = this.$refs.canvas;
      this.canvas.width = size.width;
      this.canvas.height = size.height;
      this.context = this.canvas.getContext('2d');
      this.entities = entities;
    },

    start() {
      this.started = true;
      this.main(this.lastTime);
    },

    stop() {
      cancelAnimationFrame(this.raf);
      this.started = false;
    },

    main(now) {
      this.gameTick = now - this.lastTime;

      const delta = this.gameTick / 1000;

      this.fps = Math.round(1 / delta);
      this.lastTime = now;

      if (typeof this.update === 'function') {
        this.entities = this.update(now);
      }

      this.render();

      if (this.started) {
        this.raf = requestAnimationFrame(this.main);
      }
    },

    render() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = 0; i < this.entities.length; i++) {
        const entity = this.entities[i];
        const renderFunction = entity.getRenderFunction();

        this[renderFunction](entity.props);
      }
    },
  }
}
