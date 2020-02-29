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
                <h6 class="mb-0 text-left"><strong>Block</strong></h6>
              </b-col>
              <b-col>
                <a class="mb-0 text-left" href="#">{{info.blockhash}}</a>
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
                  <h6 class="mb-0 text-left"><strong>Confirmations</strong></h6>
                </b-col>
                <b-col>
                  <h6 class="mb-0 text-left">{{info.confirmations}}</h6>
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
        <h6 class="mb-0 text-left">Inputs</h6>
      </template>

      <b-card-body v-if="info.vin[0].coinbase">
        <b-button>coinbase</b-button>
      </b-card-body>

      <b-card-body v-else>
        <div v-for="(txVin, index) in info.vin" v-bind:key="txVin.txid">
          <b-card header-tag="header">
            <template v-slot:header>
              <h6 class="mb-0 text-left">Input {{index}}</h6>
            </template>
            <b-card-body>
              <b-list-group flush>
                <b-list-group-item href="#">
                  <b-row>
                    <b-col>
                      <h6 class="mb-0 text-left"><strong>Address</strong></h6>
                    </b-col>
                    <b-col>
                      <a class="mb-0 text-left" href="#">{{txInputs[index][0].vout[txVin.vout].scriptPubKey.addresses[0]}}</a>
                    </b-col>
                  </b-row>
                </b-list-group-item>

                <b-list-group-item href="#">
                  <b-row>
                    <b-col>
                      <h6 class="mb-0 text-left"><strong>Value</strong></h6>
                    </b-col>
                    <b-col>
                      <h6 class="mb-0 text-left">{{txInputs[index][0].vout[txVin.vout].value}}</h6>
                    </b-col>
                  </b-row>
                </b-list-group-item>

                <b-list-group-item href="#">
                  <b-row>
                    <b-col>
                      <h6 class="mb-0 text-left"><strong>scriptPubKey</strong></h6>
                    </b-col>
                    <b-col>
                      <h6 class="mb-0 text-left">{{txInputs[index][0].vout[txVin.vout].scriptPubKey.asm}}</h6>
                    </b-col>
                  </b-row>
                </b-list-group-item>
              </b-list-group>
            </b-card-body>
          </b-card>
          <br>
        </div>
      </b-card-body>
    </b-card>
    <br>

    <b-card
    header-tag="header">
      <template v-slot:header>
        <h6 class="mb-0 text-left">Outputs</h6>
      </template>
      <b-card-body>
        <div v-for="(txVout, index) in info.vout" v-bind:key="txVout.txid">
          <b-card header-tag="header">
            <template v-slot:header>
              <h6 class="mb-0 text-left">Output {{index}}</h6>
            </template>

            <b-card-body v-if="txVout.scriptPubKey.type == 'nulldata'">
              <b-button>OP_RETURN</b-button>
            </b-card-body>

            <b-card-body v-else>
              <b-list-group flush>
                <b-list-group-item href="#">
                  <b-row>
                    <b-col>
                      <h6 class="mb-0 text-left"><strong>Address</strong></h6>
                    </b-col>
                    <b-col>
                      <a class="mb-0 text-left" href="#">{{txVout.scriptPubKey.addresses[0]}}</a>
                    </b-col>
                  </b-row>
                </b-list-group-item>

                <b-list-group-item href="#">
                  <b-row>
                    <b-col>
                      <h6 class="mb-0 text-left"><strong>Value</strong></h6>
                    </b-col>
                    <b-col>
                      <h6 class="mb-0 text-left">{{txVout.value}}</h6>
                    </b-col>
                  </b-row>
                </b-list-group-item>

                <b-list-group-item href="#">
                  <b-row>
                    <b-col>
                      <h6 class="mb-0 text-left"><strong>scriptPubKey</strong></h6>
                    </b-col>
                    <b-col>
                      <h6 class="mb-0 text-left">{{txVout.scriptPubKey.asm}}</h6>
                    </b-col>
                  </b-row>
                </b-list-group-item>
              </b-list-group>
            </b-card-body>
          </b-card>
          <br>
        </div>
      </b-card-body>
    </b-card>
    <br>
  </div>
</template>

<script>
export default {
  name: 'Transaction',
  data: function () {
    return {
      // page: 0
      info: '',
      block: '',
      txInputs: ''
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.axios({
        method: 'get',
        url: this.UTILS.getURL() + 'api/tx',
        params: {
          txid: this.$route.params.id
        }
      })
        .then(response => {
          this.info = response.data.getrawtransaction
          this.block = response.data.getblock
          this.txInputs = response.data.txInputs
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
    }
  }
}
</script>
