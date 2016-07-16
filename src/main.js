import moment from 'moment'
import mdl from 'material-design-lite'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import $ from 'jquery'

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
    console.log(timestamp)
    this.el.innerHTML = moment(timestamp).fromNow()
    console.log(moment(timestamp).format('YYYY-DD-MM HH:mm:ss'))
    this.interval = setInterval(() => {
      this.el.innerHTML = moment(timestamp).fromNow()
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
      let start = moment(time)
      let end = moment(time).add(1, 'h')
      if(moment().isBetween(start, end)) {
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

var App = Vue.extend({
  methods: {
    logout: function() {
      $('.mdl-layout__obfuscator').toggleClass("is-visible")
      $('.mdl-layout__drawer').toggleClass("is-visible")
      localStorage.removeItem('username')
      router.go({name:'home'})
    }
  }
})

router.map({
    '/': {
      name: 'home',
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
