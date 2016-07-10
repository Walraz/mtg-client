<template lang="pug">
h1(class="red") {{ msg }}
</template>

<script>
export default {
  data () {
    return {
      msg: 'Match!'
    }
  },
  ready () {
    this.$nextTick(() => {
       componentHandler.upgradeDom();
    })
    this.$nextTick(() => {
      componentHandler.upgradeAllRegistered()
    })
  }
}
</script>
