<template>
  <div>
    <square v-if="isLoading" v-bind:loading="isLoading"></square>
    <div v-else>
      <b-card header-tag="header">
        <template v-slot:header>
          <h6 class="mb-0 text-left">Summary <strong>{{address}}</strong> </h6>
        </template>
        <b-card-body>
          <b-list-group flush>
            <b-list-group-item
            href="#"
            v-if="addressObj.hash !== undefined"
            >
              <b-row>
                <b-col>
                  <h6 class="mb-0 text-left"><strong>Hash 160</strong></h6>
                </b-col>
                <b-col>
                  <h6 class="mb-0 text-left">{{addressObj.toString}}</h6>
                </b-col>
              </b-row>
            </b-list-group-item>

            <b-list-group-item
            href="#"
            v-if="validateaddress.scriptPubKey !== undefined"
            >
              <b-row>
                  <b-col>
                    <h6 class="mb-0 text-left"><strong>Script Public Key</strong></h6>
                  </b-col>
                  <b-col>
                    <h6 class="mb-0 text-left">{{validateaddress.scriptPubKey}}</h6>
                  </b-col>
                </b-row>
            </b-list-group-item>

            <b-list-group-item
            href="#"
            v-if="addressObj.hasOwnProperty('version')"
            >
              <b-row>
                  <b-col>
                    <h6 class="mb-0 text-left"><strong>Version</strong></h6>
                  </b-col>
                  <b-col>
                    <h6 class="mb-0 text-left">{{addressObj.version}}</h6>
                  </b-col>
                </b-row>
            </b-list-group-item>

            <b-list-group-item
            href="#"
            v-if="addressDetails && addressDetails.balanceSat"
            >
              <b-row>
                  <b-col>
                    <h6 class="mb-0 text-left"><strong>Balance</strong></h6>
                  </b-col>
                  <b-col>
                    <h6 class="mb-0 text-left">{{parseFloat(addressDetails.balanceSat) / 100000000}}</h6>
                  </b-col>
                </b-row>
            </b-list-group-item>

            <b-list-group-item
            href="#"
            v-if="addressDetails && addressDetails.txCount"
            >
              <b-row>
                  <b-col>
                    <h6 class="mb-0 text-left"><strong>Transactions</strong></h6>
                  </b-col>
                  <b-col>
                    <h6 class="mb-0 text-left">{{addressDetails.txCount}}</h6>
                  </b-col>
                </b-row>
            </b-list-group-item>

            <b-list-group-item
            href="#"
            v-if="addressQrCodeUrl"
            >
              <b-row>
                  <b-col>
                    <h6 class="mb-0 text-left"><strong>QR Code</strong></h6>
                  </b-col>
                  <b-col>
                    <!-- <h6 class="mb-0 text-left">{{addressQrCodeUrl}}</h6> -->
                    <img :src="addressQrCodeUrl">
                  </b-col>
                </b-row>
            </b-list-group-item>

          </b-list-group>
        </b-card-body>
      </b-card>

      <br>

      <b-card header-tag="header">
        <template v-slot:header>
          <h6 class="mb-0 text-left">Transactions</h6>
        </template>
        <b-card-body>
          <div v-for="(item, index) in transactions" v-bind:key="item.txid">
            <b-card header-tag="header">
              <template v-slot:header>
                <span>#{{index}} - </span>
                <b-link :href="'/tx/' + item.txid">{{item.txid}}</b-link>
                <div
                v-if="addrGainsByTx[item.txid]"
                >
                  <span>+</span>
                  {{addrGainsByTx[item.txid]}} BTC
                </div>
                <div
                v-if="addrLossesByTx[item.txid]"
                >
                  <span>-</span>
                  {{addrLossesByTx[item.txid]}} BTC
                </div>
              </template>
              <b-card-body>
                <b-row>

                  <b-col>
                    <b-button v-if="item.vin[0].coinbase">coinbase</b-button>
                    <b-card v-else>
                      <b-list-group flush>
                        <div
                        v-for="(txInput, txVinIndex) in txInputsByTransaction[item.txid]"
                        v-bind:key="txVinIndex">
                          <b-list-group-item
                          :href="'/address/' + txInput.vout[item.vin[txVinIndex].vout].scriptPubKey.addresses[0]"
                          v-if="txInput.vout[item.vin[txVinIndex].vout].scriptPubKey.addresses !== undefined"
                          >
                            <b-link
                            :href="'/address/' + txInput.vout[item.vin[txVinIndex].vout].scriptPubKey.addresses[0]"
                            v-if="txInput.vout[item.vin[txVinIndex].vout].scriptPubKey.addresses !== undefined"
                            >
                            {{txInput.vout[item.vin[txVinIndex].vout].scriptPubKey.addresses[0]}}
                            </b-link>
                            <b-button v-else>OP_RETURN</b-button>
                            <div>{{txInput.vout[item.vin[txVinIndex].vout].value}}</div>
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
                        v-for="(txOutput, txVoutIndex) in item.vout"
                        v-bind:key="txVoutIndex">
                          <b-list-group-item
                          :href="'/address/' + txOutput.scriptPubKey.addresses[0]"
                            v-if="txOutput.scriptPubKey.addresses !== undefined"
                          >
                            <a
                            class="mb-0 text-left"
                            :href="'/address/' + txOutput.scriptPubKey.addresses[0]"
                            v-if="txOutput.scriptPubKey.addresses !== undefined"
                            >
                            {{txOutput.scriptPubKey.addresses[0]}}
                            </a>
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
  </div>
</template>

<script>
export default {
  name: 'Address',
  data: function () {
    return {
      // page: 0
      address: '',
      addressObj: '',
      validateaddress: '',
      getblockchaininfo: '',
      addressDetails: '',
      transactions: '',
      txInputsByTransaction: '',
      addrGainsByTx: '',
      addrLossesByTx: '',
      blockHeightsByTxid: '',
      addressQrCodeUrl: '',
      isLoading: true
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.axios({
        method: 'get',
        url: this.UTILS.getURL() + 'api/address',
        params: {
          address: this.$route.params.id
        }
      })
        .then(response => {
          var resData = response.data
          this.address = resData.address
          this.addressObj = resData.addressObj
          this.validateaddress = resData.validateaddress
          this.getblockchaininfo = resData.getblockchaininfo
          this.transactions = resData.transactions
          this.txInputsByTransaction = resData.txInputsByTransaction
          this.addrGainsByTx = resData.addrGainsByTx
          this.addrLossesByTx = resData.addrLossesByTx
          this.blockHeightsByTxid = resData.blockHeightsByTxid
          this.addressDetails = resData.addressDetails
          this.addressQrCodeUrl = resData.addressQrCodeUrl
          this.isLoading = false
        })
        .catch(error => {
          console.log(error)
          this.errored = true
          this.isLoading = false
        })
    }
  }
}
</script>
