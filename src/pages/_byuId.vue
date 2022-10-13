<template>
  <div v-if="favColor">
    <FavoriteColorCard :key="favColor" :name="name" :fav-color="favColor" :byu-id="byuId" />
  </div>
  <div v-else>
    <h1>No favorite color set yet for this BYU ID.</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FavoriteColorCard from '~/components/FavoriteColorCard.vue'

@Component({
  components: {
    FavoriteColorCard
  }
})

export default class ByuId extends Vue {
  name: string = ''
  favColor: string = ''
  byuId: string = ''

  async mounted () {
    this.byuId = this.$route.params.byuId

    // Call API and pass BYU ID
    const response = await this.$axios.$get(`https://sg738-fav-color-dev.byu-oit-fullstack-trn.amazon.byu.edu/${this.byuId}`)

    this.favColor = response.favoriteColor
    this.byuId = this.$route.params.byuId
    this.name = response.name
  }
}
</script>
