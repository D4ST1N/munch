<template>
  <div class="exploding-kittens">
    <PlayerAuth v-if="!name" @auth="setName" />
    <GameStatus v-if="showGameStatus" :name="name" @join="join" @ready="ready" />
    <GameUI />
  </div>
</template>

<script>
import PlayerAuth from './PlayerAuth';
import GameStatus from './GameStatus';
import GameUI from './GameUI';

let socket;

export default {
  name: 'ExplodingKittens',
  components: {
    PlayerAuth,
    GameStatus,
    GameUI,
  },

  data() {
    return {
      name: '',
    };
  },

  computed: {
    showGameStatus() {
      return !!this.name && !this.gameStarted;
    },
  },

  created() {
  },

  methods: {
    setName(name) {
      this.name = name;

      socket = window.io({ path: '/ws/exploding-kittens'});

      socket.emit('playerRejoin', this.name);

      socket.on('gameStatus', (stats) => {
        console.log('gameStatus', stats);
        this.$root.$emit('gameStatus', stats);
      });

      socket.on('deck', (deck) => {
        console.log('deck', deck);
        this.$root.$emit('updateDeck', deck);
      });

      socket.on('gameStart', () => {
        console.log('gameStart');
        this.$root.$emit('gameStart');
      });

      socket.on('message', console.log);
    },

    join() {
      socket.emit('playerJoin', this.name);
    },

    ready() {
      socket.emit('playerReady', this.name);
    },
  },
};
</script>

<style>

</style>
