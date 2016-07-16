<template lang="pug">
.mdl-grid.mdl-grid--no-spacing
  .mdl-cell.mdl-cell--10-col.mdl-cell--6-col-tablet.mdl-cell--12-col-phone.battlefield
    h1(class="red") {{ test }}
  .mdl-cell.mdl-cell--2-col.mdl-cell--2-col-tablet.mdl-cell--12-col-phone.chat
    .chat-messages
      .space
      .messages(v-for='msg in messages')
        p
          span.user(v-bind:class="{'me': isUser(msg.user), 'you': !isUser(msg.user)}") {{ msg.user }}
          |  - {{ msg.message }}
    .chat-input
      .mdl-textfield.mdl-js-textfield
        input#sample1.mdl-textfield__input(type='text' v-model='input')
        label.mdl-textfield__label(for='sample1') Message...
      button.mdl-button.mdl-js-button.mdl-button--raised.mdl-js-ripple-effect.mdl-button--accent(@click='sendMessage()') Send
</template>

<script>
export default {
  data () {
    return {
      test: 'Match!',
      input: '',
      messages: []
    }
  },
  methods: {
    isUser: function (user) {
      return (user === localStorage.getItem('username'))
    },
    sendMessage: function () {
      let msg = {
        message: this.input,
        id: this.$route.params.id,
        user: localStorage.getItem('username')
      }
      this.messages.push(msg)
      socket.emit('send message', msg)
      this.input = ''
    }
  },
  ready () {
    let vm = this
    socket.on('get message', function(msg) {
      vm.messages.push(msg)
    })
    this.$nextTick(() => {
       componentHandler.upgradeDom();
    })
    this.$nextTick(() => {
      componentHandler.upgradeAllRegistered()
    })
  }
}
</script>
