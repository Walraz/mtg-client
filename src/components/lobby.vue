<template lang="pug">
.mdl-grid
  .mdl-cell.mdl-cell--4-col.mdl-cell--4-col-tablet.mdl-cell--12-col-phone.mdl-grid.mdl-grid--no-spacing
    .host-match-card.mdl-card.mdl-shadow--2dp.mdl-cell.mdl-cell--12-col(v-show='isHosting')
      .mdl-card__title
        h2.mdl-card__title-text Host
      .mdl-card__supporting-text
        p You are hosting a game & wating for player to join...
      //.mdl-card__actions.mdl-card--border
        a.mdl-button.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(@click='createMatch' v-bind:class="{'mdl-button--disabled': true}") Enter Game
      .mdl-card__menu
        button.mdl-button.mdl-button--icon.mdl-js-button.mdl-js-ripple-effect
          i.material-icons share
    .host-match-card.mdl-card.mdl-shadow--2dp.mdl-cell.mdl-cell--12-col(v-show='!isHosting')
      .mdl-card__title
        h2.mdl-card__title-text Lobby
      .mdl-card__supporting-text
        p Host a MTG match now!
        label.mdl-radio.mdl-js-radio.mdl-js-ripple-effect(for='option-1')
          input#option-1.mdl-radio__button(type='radio', name='options', value='Single Game', checked='' v-model='host.Structure')
          span.mdl-radio__label Single Game
        .mdl-layout-spacer
        label.mdl-radio.mdl-js-radio.mdl-js-ripple-effect(for='option-2')
          input#option-2.mdl-radio__button(type='radio', name='options', value='BO3' v-model='host.Structure')
          span.mdl-radio__label Best of 3
      .mdl-card__actions.mdl-card--border
        a.mdl-button.mdl-button--colored.mdl-js-button.mdl-js-ripple-effect(@click='createMatch') Create Match
      .mdl-card__menu
        button.mdl-button.mdl-button--icon.mdl-js-button.mdl-js-ripple-effect
          i.material-icons share
    .space.mdl-cell--1-col
  .mdl-cell.mdl-cell--8-col.mdl-cell--8-col-tablet.mdl-cell--12-col-phone.mdl-grid.mdl-grid--no-spacing
    table.list-matches.mdl-data-table.mdl-js-data-table.mdl-shadow--2dp.mdl-cell.mdl-cell--12-col(v-show='isGames(false)')
      thead
        tr
          th.mdl-data-table__cell--non-numeric.hide-mobile Status
          th.mdl-data-table__cell--non-numeric Players
          th.mdl-data-table__cell--non-numeric Structure
      tbody
        template(v-for="match in hostedMatches | filterBy 'false' in 'Game_On' | orderBy 'Time_Created' -1")
          tr(v-remove-old-host="match.Time_Created" @click='startDuel( match.Host, match.Game_On, match.Id)' v-bind:class="{ 'isHost': isHost(match.Host)}")
            td.mdl-data-table__cell--non-numeric.hide-mobile
              div(v-moment-ago='match.Time_Created')
            td.mdl-data-table__cell--non-numeric
              |  {{ match.Host }},
              span(style='color: #67FFB0; font-weight: 700' v-show='!match.Game_On')  (Open)
              span(v-show='match.Game_On')  {{ match.Opponents }}
            td.mdl-data-table__cell--non-numeric {{ match.Structure }}
    .padding-vertical.mdl-cell.mdl-cell--12-col(v-show='isGames(false) || !isGames(true)')
    table.list-matches.mdl-data-table.mdl-js-data-table.mdl-shadow--2dp.mdl-cell.mdl-cell--12-col(v-show='isGames(true)')
      thead
        tr
          th.mdl-data-table__cell--non-numeric.hide-mobile Status
          th.mdl-data-table__cell--non-numeric Players
          th.mdl-data-table__cell--non-numeric Structure
      tbody
        tr(v-for="matchOn in hostedMatches | filterBy 'true' in 'Game_On' | orderBy 'Time_Created' -1")
          td.mdl-data-table__cell--non-numeric.hide-mobile
            div(v-moment-ago='matchOn.Time_Created')
          td.mdl-data-table__cell--non-numeric
            |  {{ matchOn.Host }}, {{ matchOn.Opponents }}
          td.mdl-data-table__cell--non-numeric {{ matchOn.Structure }}
</template>

<script>
import moment from 'moment'
export default {
  data: function () {
    return {
      isHosting: false,
      host: {Host: localStorage.getItem('username'), Structure: 'Single Game'},
      hostedMatches: []
    }
  },
  methods: {
    isHost: function(user) {
      return (user === localStorage.getItem('username'))
    },
    isGames: function(state) {
      var isGame = false
      this.hostedMatches.forEach((game) => {
        if(game.Game_On === state) {
          isGame = true
        }
      })
      return isGame
    },
    createMatch: function () {
      this.$http.post(URL.API+'/1/mtg-games', this.host).then((res) => {
        let data = JSON.parse(res.body)
        socket.emit('created match', 'GameId_' + data.Id)
      })
    },
    startDuel: function(host, gameOn, id) {
      if(localStorage.getItem('username') !== host) {
        let match = {
          Id: id,
          Opponents: localStorage.getItem('username') + '_DUELIST'
        }
        if(!gameOn) {
          match.Game_On = true
          this.$http.put(URL.API+'/1/mtg-games', match).then((res) => {
            let data = JSON.parse(res.body)
            socket.emit('joined match', data.Id)
          })
        }
      }
    },
    isGameOn: function (game) {
      return (game === 1) ? true : false
    }
  },
  ready () {
    let vm = this
    // Get Hosts
    this.$http.get(URL.API+'/1/mtg-games').then((res) => {
      let data = JSON.parse(res.body)
      data.forEach((host) => {
        host.Game_On = vm.isGameOn(host.Game_On)
        if(localStorage.getItem('username') === host.Host) vm.isHosting = true
      })
      vm.hostedMatches = data
    }, (err) => {
      console.log(err.status)
    })
    socket.on('create match', function(host) {
      host.Game_On = vm.isGameOn(host.Game_On)
      vm.isHosting = true
      vm.hostedMatches.push(host)
    })
    socket.on('join match', function(match) {
      let matchRoom = 'GameId_' + match.Id
      let id = vm.hostedMatches.map(function(e) { return e.Id; }).indexOf(match.Id)
      vm.hostedMatches[id].Game_On = match.Game_On
      vm.hostedMatches[id].Opponents = match.Opponents
    })
    socket.on('start match', function(id) {
      vm.$router.go({name:'match', params: {id: id}})
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
