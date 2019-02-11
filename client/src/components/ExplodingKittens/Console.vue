<template>
  <div class="console">
    <div v-show="show" class="console__wrapper">
      <input type="text" v-model="search" ref="search" class="console__command-line" @keydown="onKeyDown">
      <ul class="console__commands">
        <li
          v-for="(command, index) in filteredCommands"
          :key="command.name"
          :class="{ 'console__command': true, 'console__command--selected': index === commandIndex }"
        >
          {{ command.name }}
          <span v-if="command.options" class="console__command-options">
            (<span v-for="option in command.options" :key="option"><{{ option }}></span>)
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Console',

    data() {
      return {
        show: false,
        commands: [
          {
            name: '_getCard',
            options: ['cardType'],
          },
          {
            name: '_getDefuse',
          },
          {
            name: '_shuffle',
          },
          {
            name: '_showGameDeck'
          },
          {
            name: '_saveLogs'
          },
        ],
        search: '',
        commandIndex: null,
      };
    },

    computed: {
      filteredCommands() {
        if (this.search === '') {
          return [];
        }

        return this.commands.filter(command => command.name.includes(this.search));
      }
    },

    created() {
      this.$root.$on('showConsole', () => {
        this.show = true;
        this.$nextTick(() => {
          if (this.$refs.search) {
            this.$refs.search.focus();
          }
        });
      });
      this.$root.$on('hideConsole', () => {
        this.show = false;
      });
    },

    methods: {
      onKeyDown(event) {
        if (event.code === 'ArrowDown') {
          event.preventDefault();
          this.movePointerDown();
        }

        if (event.code === 'ArrowUp') {
          event.preventDefault();
          this.movePointerUp();
        }

        if (event.code === 'Enter') {
          if (event.shiftKey) {
            this.processCommand();
          } else if (this.commandIndex !== null && this.filteredCommands[this.commandIndex]) {
            this.search = this.filteredCommands[this.commandIndex].name;
          }
        }
      },

      processCommand() {
        const [ command, ...options ] = this.search.match(/[\w-]+/g);
        console.log(command, options);
        this.$store.getters.socket.emit(command, {
          name: this.$store.getters.player.username,
          roomId: this.$route.params.id,
          options,
        });
        this.show = false;
        this.search = '';
        this.commandIndex = null;
      },

      movePointerDown() {
        if (this.commandIndex === null) {
          this.commandIndex = 0;
        } else if (this.commandIndex + 1 === this.filteredCommands.length) {
          this.commandIndex = 0;
        } else {
          this.commandIndex += 1;
        }
      },

      movePointerUp() {
        if (!this.commandIndex) {
          this.commandIndex = this.filteredCommands.length - 1;
        } else {
          this.commandIndex -= 1;
        }
      }
    },
  };
</script>

<style lang="scss">
  .console {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;

    &__wrapper {
      pointer-events: all;
      position: relative;
    }

    &__command-line {
      border: 0;
      background: rgba(91, 115, 132, 1);
      border-bottom: 2px solid #fff8;
      padding: 8px 16px;
      font-size: 24px;
      width: 50vh;
      color: #fff;

      &:focus {
        outline: none;
        border-bottom: 2px solid #ffff;
      }
    }

    &__commands {
      position: absolute;
      top: 100%;
      margin: 0;
      padding: 0;
    }

    &__command {
      display: block;
      padding: 5px 12px;
      background: rgba(110, 138, 160, 1);
      color: #fff8;
      transition: all .375s ease;

      &--selected {
        background: rgba(89, 117, 131, 1);
        color: #fffa;
      }
    }
  }
</style>
