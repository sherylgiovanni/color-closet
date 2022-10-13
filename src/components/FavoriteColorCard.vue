<template>
  <v-card
    elevation="2"
    outlined
    shaped
    class="mx-auto"
    max-width="500"
  >
    <div>
      <v-card-title>{{ name }} - {{ byuId }}</v-card-title>
      <v-card-subtitle>Favorite color: {{ favColor }}</v-card-subtitle>
      <v-list-item-avatar
        tile
        size="90"
        :color="color"
      />
    </div>

    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          class="edit-button"
          color="blue lighten-2"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Edit
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Edit your favorite color
        </v-card-title><br>

        <v-card-text>
          Select a color
        </v-card-text>
        <v-select
          v-model="color"
          :items="colors"
          label="Colors"
          outlined
          @change="changeColor()"
        />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          color="red"
          dark
          v-bind="attrs"
          v-on="on"
          @click="deleteFavoriteColor()"
        >
          Delete
        </v-btn>
      </template>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { colors } from '~/components/colors'

@Component
export default class FavoriteColorCard extends Vue {
  @Prop({ required: true })
    name?: string

  @Prop({ required: true })
    favColor?: string

  @Prop({ required: true })
    byuId?: string

  color: string = ''
  mounted () {
    this.color = this.favColor ?? ''
  }

  async changeColor () {
    await this.$axios.put(`https://sg738-fav-color-dev.byu-oit-fullstack-trn.amazon.byu.edu/${this.byuId}`, {
      favoriteColor: this.color
    })
    this.$router.go(0) // refresh page
  }

  async deleteFavoriteColor () {
    await this.$axios.delete(`https://sg738-fav-color-dev.byu-oit-fullstack-trn.amazon.byu.edu/${this.byuId}`)
    this.$router.go(0) // refresh page
  }

  colors = colors
}
</script>

<style>
.color-card {
  margin: 20pt;
}
.edit-button {
  margin: 10px;
}
.card {
  padding: 15pt;
}
</style>
