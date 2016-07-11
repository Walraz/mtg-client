import moment from 'moment'
import mdl from 'material-design-lite'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

// Components
import HomeComponent from './components/home.vue'
import LobbyComponent from './components/lobby.vue'
import MatchComponent from './components/match.vue'

window.URL = { 'SOCKET': '@@SOCKET', 'API': '@@API' }
window.Vue = Vue;

Vue.use(VueRouter)
Vue.use(VueResource)

let router = new VueRouter({
  history: true,
  transitionOnLoad: true,
  root: '/'
})

Vue.directive('moment-ago', {
  update (timestamp) {
    this.el.innerHTML = moment.utc(timestamp).fromNow()

    this.interval = setInterval(() => {
      this.el.innerHTML = moment.utc(timestamp).fromNow()
    }, 60000)
  },

  unbind () {
    clearInterval(this.interval)
  }
})

Vue.directive('remove-old-host', {
  update: function (timestamp) {
    let that = this

    function isOldHost(time) {
      let end = moment.utc(time).add(1, 'h')
      if(moment().isBetween(time, end)) {
        that.el.style.display = 'table-row'
      } else {
        that.el.style.display = 'none'
      }
    }

    isOldHost(timestamp)

    this.interval = setInterval(() => {
      isOldHost(timestamp)
    }, 60000)

  },
  unbind: function () {
    clearInterval(this.interval)
  }
})

var App = Vue.extend({})

router.map({
    '/': {
      component: HomeComponent
    },
    '/lobby': {
      name: 'lobby',
      component: LobbyComponent
    },
    '/match/:id': {
        name: 'match',
        component: MatchComponent
    }
})

router.start(App, '#app')
