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
    this.el.innerHTML = moment(timestamp).utc().fromNow()

    this.interval = setInterval(() => {
      this.el.innerHTML = moment(timestamp).utc().fromNow()
    }, 60000)
  },

  unbind () {
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
