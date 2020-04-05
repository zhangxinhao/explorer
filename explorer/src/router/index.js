import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Blocks from '../views/Blocks'
import BlockHeight from '../views/BlockHeight'
import Transaction from '../views/Transaction'
import Address from '../views/Address'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/blocks',
    name: 'Blocks',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Blocks,
    props: (route) => ({
      page: route.query.page
    })
  },
  {
    path: '/blockheight/:id',
    name: 'BlockHeight',
    component: BlockHeight
  },
  {
    path: '/tx/:id',
    name: 'Transaction',
    component: Transaction
  },
  {
    path: '/address/:id',
    name: 'Address',
    component: Address
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
