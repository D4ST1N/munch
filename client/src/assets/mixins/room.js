import { mapGetters } from 'vuex';
import Socket from '../../entities/Socket';

export default {
  created() {
    Socket.emit('knockKnock', {
      roomId: this.$route.params.id,
      event: 'roomStatus'
    });

    Socket.on('roomStatus', this.onRoomStatus);
  },

  beforeDestroy() {
    Socket.off('roomStatus', this.onRoomStatus);
  },

  methods: {
    ...mapGetters([
      'player',
    ]),

    onRoomStatus({ exist }) {
      if (exist) {
        this.joinRoom();
      } else {
        this.$router.push('/room/404');
      }
    },

    joinRoom() {
      this.player().joinRoom(this.$route.params.id);
    },
  },
};
