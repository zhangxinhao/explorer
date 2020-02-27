<template>
  <div class="home">
    <b-container>
      <BlockList></BlockList>
    </b-container>
  </div>

</template>

<script>
// @ is an alias to /src
import BlockList from '../components/BlockList'

export default {
  name: 'Home',
  components: {
    BlockList
  }
}
</script>
