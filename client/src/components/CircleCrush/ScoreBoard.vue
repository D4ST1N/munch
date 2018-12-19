<template>
  <div class="scoreboard">
    <transition-group name="sore" class="scoreboard__wrapper">
      <div v-for="score in playersScore" :key="score[0]" class="scoreboard__score">
        {{ score[0] }} - {{ score[1] }}
      </div>
    </transition-group>
  </div>
</template>

<script>
  export default {
    name: "ScoreBoard",

    data() {
      return {
        score: {},
      };
    },

    computed: {
      playersScore() {
        return Object.entries(this.score).sort((player1, player2) => player2[1] - player1[1]);
      }
    },

    created() {
      this.$root.$on('score', (score) => {
        console.log(score);
        this.score = score;
      });
    }
  }
</script>

<style lang="scss">
  .scoreboard {
    position: fixed;
    top: 10px;
    right: 10px;
    color: #fff;
    pointer-events: none;

    &__wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }
  }
  .score-move {
    transition: transform 1s;
  }
</style>
