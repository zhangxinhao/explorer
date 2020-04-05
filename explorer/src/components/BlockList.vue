<template>
  <div class="block-list">
    <b-container>
      <b-card no-body class="mb-4 shadow-sm">
        <b-card-body>
          <b-table striped hover
          :items="items"
          caption-top
          :fields="fields"
          border-variant="secondary"
          >
            <template v-slot:table-caption>
              <b-container class="bv-example-row">
                <b-row>
                  <b-col>
                    <h4>Latest Blocks</h4>
                  </b-col>
                  <b-col>
                    <b-link to="/blocks?page=1" class="text-right">
                      <h4>Browse Blocks</h4>
                    </b-link>
                  </b-col>
                </b-row>
              </b-container>
            </template>
            <template v-slot:cell(Height)="data">
              <b-link :href="'/blockheight/' + data.item.Height">{{data.item.Height}}</b-link>
            </template>
          </b-table>
        </b-card-body>
      </b-card>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'BlockList',
  props: {
    msg: String
  },
  data: function () {
    return {
      items: [],
      info: '',
      limit: 10,
      fields: ['Height', 'Timestamp', 'Transactions', 'Size']
    }
  },
  methods: {
    blocks: function () {
      this.axios({
        method: 'get',
        url: this.UTILS.getURL() + 'api/blocks',
        params: {
          limit: this.limit
        }
      })
        .then(response => {
          var list = response.data
          this.info = list
          var length = list.length
          for (let index = 0; index < length; index++) {
            var temp = list[index]
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
