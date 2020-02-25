<template>
  <div class="block">
    <b-table striped hover :items="items"></b-table>
  </div>
</template>

<script>
import * as utils from '../store/utils'
export default {
  name: 'Blocks',
  props: {
    msg: String
  },
  data: function () {
    return {
      items: [],
      info: ''
    }
  },
  methods: {
    blocks: function () {
      this.axios
        .get(utils.getURL() + 'api/blocks')
        .then(response => {
          var list = response.data
          this.info = list
          var length = list.length
          for (let index = 0; index < length; index++) {
            var temp = list[index][0]
            this.items.push({
              Height: temp.height,
              Timestamp: this.time(temp.time * 1000),
              Transactions: temp.tx.length,
              Size: temp.size
            })
          }
          return this.info
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
    },
    time: function (time) {
      var date = new Date(time + 8 * 3600 * 1000) // 增加8小时
      return date.toJSON().substr(0, 19).replace('T', ' ')
    }
  },
  mounted: function () {
    this.blocks()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
