<template lang="pug">
.mdl-grid.page-content
  .login-card.mdl-card.mdl-shadow--2dp.mdl-cell.mdl-cell--6-col
    .mdl-card__title
      h2.mdl-card__title-text Welcome
    .mdl-card__supporting-text
      p Choose a nickname and enter
      form(action='#')
        .mdl-textfield.mdl-js-textfield.mdl-textfield--floating-label
          input#sample3.mdl-textfield__input(type='text'  v-model='username')
          label.mdl-textfield__label(for='sample3') Nickname
    .mdl-card__actions.mdl-card--border
      a.mdl-button.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(@click='login') Login
    .mdl-card__menu
      button.mdl-button.mdl-button--icon.mdl-js-button.mdl-js-ripple-effect
        i.material-icons share
</template>

<script>
export default {
  data: function() {
    return {
      username: ''
    }
  },
  methods: {
    login: function() {
      if(this.username.length > 0) {
        localStorage.setItem("username", this.username)
        this.$router.go({name:'lobby'})
      }
    }
  }
}
</script>
