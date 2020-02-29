<template>
  <div class="blocks">
    <b-container>
      <square v-if="isLoading" v-bind:loading="isLoading"></square>
      <b-card v-else class="mb-4 shadow-sm">
        <b-table
        striped
        hover
        :items="items"
        caption-top>
          <template v-slot:table-caption>
            <b-container class="bv-example-row">
              <h4>Blocks</h4>
            </b-container>
          </template>
          <template v-slot:cell(Height)="data">
              <b-link :href="'/blockheight/' + data.item.Height">{{data.item.Height}}</b-link>
            </template>
        </b-table>
        <b-pagination-nav
        v-model="currentPage"
        :link-gen="linkGen"
        :number-of-pages="totalPage"
        use-router
        >
        </b-pagination-nav>
      </b-card>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Blocks',
  props: ['page'],
  data: function () {
    return {
      // page: 0
      items: [],
      info: '',
      currentPage: 1,
      limit: 15,
      totalPage: 15,
      isLoading: true
    }
  },
  created () {
    this.fetchData()
    this.axios
      .get(this.UTILS.getURL() + 'api/blockchaininfo')
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
        path: '/blocks',
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
        url: this.UTILS.getURL() + 'api/blocks',
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
          this.isLoading = false
        })
        .catch(error => {
          console.log(error)
          this.errored = true
          this.isLoading = false
        })
    },
    time: function (time) {
      var date = new Date(time + 8 * 3600 * 1000) // 增加8小时
      return date.toJSON().substr(0, 19).replace('T', ' ')
    }
  }
}
</script>
