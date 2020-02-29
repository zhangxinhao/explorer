<template>
  <div>
    <b-card
    header-tag="header">
      <template v-slot:header>
        <h6 class="mb-0 text-left">Summary</h6>
      </template>
      <b-card-body>
        <b-list-group flush>
          <b-list-group-item href="#">
            <b-row>
              <b-col>
                <h6 class="mb-0 text-left"><strong>Previous Block</strong></h6>
              </b-col>
              <b-col>
                <a class="mb-0 text-left" href="#">{{info.previousblockhash}}</a>
              </b-col>
            </b-row>
          </b-list-group-item>

          <b-list-group-item href="#">
            <b-row>
                <b-col>
                  <h6 class="mb-0 text-left"><strong>Next Block</strong></h6>
                </b-col>
                <b-col>
                  <a class="mb-0 text-left" href="#">{{info.nextblockhash}}</a>
                </b-col>
              </b-row>
          </b-list-group-item>

          <b-list-group-item href="#">
            <b-row>
                <b-col>
                  <h6 class="mb-0 text-left"><strong>Height</strong></h6>
                </b-col>
                <b-col>
                  <h6 class="mb-0 text-left">{{info.height}}</h6>
                </b-col>
              </b-row>
          </b-list-group-item>

          <b-list-group-item href="#">
            <b-row>
                <b-col>
                  <h6 class="mb-0 text-left"><strong>Timestamp</strong></h6>
                </b-col>
                <b-col>
                  <h6 class="mb-0 text-left">{{info.time}}</h6>
                </b-col>
              </b-row>
          </b-list-group-item>

          <b-list-group-item href="#">
            <b-row>
                <b-col>
                  <h6 class="mb-0 text-left"><strong>Confirmations</strong></h6>
                </b-col>
                <b-col>
                  <h6 class="mb-0 text-left">{{info.confirmations}}</h6>
                </b-col>
              </b-row>
          </b-list-group-item>

          <b-list-group-item href="#">
            <b-row>
                <b-col>
                  <h6 class="mb-0 text-left"><strong>Size</strong></h6>
                </b-col>
                <b-col>
                  <h6 class="mb-0 text-left">{{info.size}}</h6>
                </b-col>
              </b-row>
          </b-list-group-item>

          <b-list-group-item href="#">
            <b-row>
                <b-col>
                  <h6 class="mb-0 text-left"><strong>Stripped Size</strong></h6>
                </b-col>
                <b-col>
                  <h6 class="mb-0 text-left">{{info.strippedsize}}</h6>
                </b-col>
              </b-row>
          </b-list-group-item>

          <b-list-group-item href="#">
            <b-row>
                <b-col>
                  <h6 class="mb-0 text-left"><strong>Weight</strong></h6>
                </b-col>
                <b-col>
                  <h6 class="mb-0 text-left">{{info.weight}}</h6>
                </b-col>
              </b-row>
          </b-list-group-item>

          <b-list-group-item href="#">
            <b-row>
                <b-col>
                  <h6 class="mb-0 text-left"><strong>Tx Count</strong></h6>
                </b-col>
                <b-col>
                  <h6 class="mb-0 text-left">{{info.nTx}}</h6>
                </b-col>
              </b-row>
          </b-list-group-item>

          <b-list-group-item href="#">
            <b-row>
                <b-col>
                  <h6 class="mb-0 text-left"><strong>Difficulty</strong></h6>
                </b-col>
                <b-col>
                  <h6 class="mb-0 text-left">{{info.difficulty}}</h6>
                </b-col>
              </b-row>
          </b-list-group-item>

          <b-list-group-item href="#">
            <b-row>
                <b-col>
                  <h6 class="mb-0 text-left"><strong>Merkle Root</strong></h6>
                </b-col>
                <b-col>
                  <h6 class="mb-0 text-left">{{info.merkleroot}}</h6>
                </b-col>
              </b-row>
          </b-list-group-item>
        </b-list-group>
      </b-card-body>
    </b-card>
    {{items}}
  </div>
</template>

<script>
export default {
  name: 'BloclHeight',
  data: function () {
    return {
      // page: 0
      info: '',
      items: ''
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.axios({
        method: 'get',
        url: this.UTILS.getURL() + 'api/block-height',
        params: {
          blockHeight: this.$route.params.id
        }
      })
        .then(response => {
          this.info = response.data.getblock
          this.items = response.data.transactions[0][0].txid
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
    }
  }
}
</script>
