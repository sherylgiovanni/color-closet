<template :key="favColor">
  <div v-if="favColor">
    <FavoriteColorCard
      :key="favColor"
      :name="$store.state.user.name.displayName"
      :fav-color="favColor"
      :byu-id="$store.state.user.byuId"
    />
  </div>

  <div v-else>
    <v-dialog
      v-model="dialog"
      width="1000"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          class="edit-button"
          color="blue lighten-2"
          dark
          v-bind="attrs"
          width="200"
          v-on="on"
        >
          Set Color
        </v-btn>
      </template>

      <v-card class="card">
        <v-card-title class="text-h5 grey lighten-2">
          Set Color
        </v-card-title><br>

        <v-card-text>Select a color</v-card-text>
        <v-select
          v-model="newFavColor"
          :items="colors"
          label="Colors"
          outlined
        />

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn color="primary" text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="addFavoriteColor(); dialog = false">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
      <h1>No favorite color set yet.</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FavoriteColorCard from '~/components/FavoriteColorCard.vue'
import { colors } from '~/components/colors'

@Component({
  components: {
    FavoriteColorCard
  }
})

export default class Me extends Vue {
  name: string = ''
  favColor: string = ''
  newFavColor: string = ''
  byuId: string = ''
  students = []
  colors = colors

  async mounted () {
    const currentByuId = this.$store.state.user.byuId
    const response = await this.$axios.$get('https://sg738-fav-color-dev.byu-oit-fullstack-trn.amazon.byu.edu/')

    // see if the list of people contains the currently logged-in user
    const person = response.find((obj) => {
      return obj.byuId === currentByuId
    })

    this.favColor = person?.favoriteColor
  }

  async addFavoriteColor () {
    const response = await this.$axios.$post('https://sg738-fav-color-dev.byu-oit-fullstack-trn.amazon.byu.edu/'
      , {
        byuId: this.$store.state.user.byuId,
        name: this.$store.state.user.name.displayName,
        favoriteColor: this.newFavColor
      })

    // add new favorite color to list of students
    this.students.push.apply(this.students, response)
    this.$router.go(0) // refresh page
  }

  dialog = false
}

</script>

<style scoped>
</style>
