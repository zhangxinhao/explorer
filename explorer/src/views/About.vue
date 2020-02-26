<template>
  <div class="overflow-auto">
    <b-container>
      <b-table striped hover :items="items"></b-table>
      <b-pagination-nav
      v-model="currentPage"
      :link-gen="linkGen"
      :number-of-pages="totalPage"
      use-router></b-pagination-nav>
    </b-container>
  </div>
</template>

<script>
import * as utils from '../store/utils'
export default {
  props: ['page'],
  data: function () {
    return {
      // page: 0
      items: [],
      info: '',
      currentPage: 1,
      limit: 15,
      totalPage: 15
    }
  },
  created () {
    this.fetchData()
    this.axios
      .get(utils.getURL() + 'api/blockchaininfo')
      .then(response => {
        this.totalPage = Math.ceil(response.data.blocks / this.limit)
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    linkGen (pageNum) {
      return {
        path: '/about',
        query: {
          page: pageNum,
          limit: this.limit,
          offset: (pageNum - 1) * this.limit
        }
      }
    },
    fetchData () {
      this.axios({
        method: 'get',
        url: utils.getURL() + 'api/blocks',
        params: {
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        }
      })
        .then(response => {
          this.items = []
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
  }
}
</script>
