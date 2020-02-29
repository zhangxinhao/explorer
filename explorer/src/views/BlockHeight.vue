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
    <br>

    <b-card
    header-tag="header">
      <template v-slot:header>
        <h6 class="mb-0 text-left">Transactions</h6>
      </template>
      <b-card-body>
        <div v-for="(item, index) in items" v-bind:key="item.txid">
          <b-card header-tag="header">
            <template v-slot:header>
              <span>#{{index}} - </span>
              <b-link :href="'/tx/' + item[0].txid">{{item[0].txid}}</b-link>
            </template>
            <b-card-body>
              <b-row>

                <b-col>
                  <b-button v-if="item[0].vin[0].coinbase">coinbase</b-button>
                  <b-card v-else>
                    <b-list-group flush>
                      <div
                      v-for="(txInput, txVinIndex) in txInputsByTransaction[item[0].txid]"
                      v-bind:key="txVinIndex">
                        <b-list-group-item href="#">
                          <a class="mb-0 text-left" href="#">{{txInput.vout[item[0].vin[txVinIndex].vout].scriptPubKey.addresses[0]}}</a>
                          <div>{{txInput.vout[item[0].vin[txVinIndex].vout].value}}</div>
                        </b-list-group-item>
                      </div>
                    </b-list-group>
                  </b-card>
                </b-col>
                <br>

                <b-col>
                  <b-card>
                    <b-list-group flush>
                      <div
                      v-for="(txOutput, txVoutIndex) in item[0].vout"
                      v-bind:key="txVoutIndex">
                        <b-list-group-item href="#">
                          <a class="mb-0 text-left" href="#" v-if="txOutput.scriptPubKey.type != 'nulldata'">{{txOutput.scriptPubKey.addresses[0]}}</a>
                          <b-button v-else>OP_RETURN</b-button>
                          <div>{{txOutput.value}}</div>
                        </b-list-group-item>
                      </div>
                    </b-list-group>
                  </b-card>
                </b-col>

              </b-row>
            </b-card-body>
          </b-card>

          <br>

        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'BloclHeight',
  data: function () {
    return {
      // page: 0
      info: '',
      items: '',
      txInputsByTransaction: ''
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
          this.items = response.data.transactions
          this.txInputsByTransaction = response.data.txInputsByTransaction
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
    }
  }
}
</script>
