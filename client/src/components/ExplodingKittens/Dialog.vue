<template>
  <div class="dialog">
    <div v-if="show" class="dialog__wrapper">
      <Timer :time="time" @timerEnd="onTimerEmd" />
      <div class="dialog__content">
        <h2 class="dialog__title">{{ title }}</h2>
        <p class="dialog__text">{{ text }}</p>
        <div class="dialog__actions">
          <Button
            v-for="(action, index) in actions"
            :key="index"
            :text="action.text"
            :type="action.type"
            :size="action.size"
            @buttonClick="onButtonClick(action, ...arguments)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Timer from './Timer';

  export default {
    name: 'Dialog',
    components: {
      Timer,
    },

    data() {
      return {
        title: '',
        text: '',
        actions: [],
        time: 0,
        show: false,
        onEnd: null,
      };
    },

    created() {
      this.$root.$on('showDialog', ({ title, text, actions, time, onEnd = () => {} }) => {
        this.title = title;
        this.text = text;
        this.actions = actions;
        this.time = time;
        this.onEnd = onEnd;
        this.show = true;
      });
      this.$root.$on('hideDialog', () => {
        this.show = false;
      });
    },

    methods: {
      onTimerEmd() {
        console.log('timer end');
        if (typeof this.onEnd === 'function') {
          this.onEnd.call(this);
        }
      },
      onButtonClick(action) {
        action.action.call(this);
      }
    },
  };
</script>

<style lang="scss">
  .dialog {
    position: fixed;
    top: 20vh;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__wrapper {
      background: rgb(69,90,100);
      color: #fff;
      padding: 10px 20px;
      display: flex;
      border-radius: 16px;
    }

    &__content {
      margin-left: 20px;
      margin-bottom: 10px;
    }
  }
</style>
