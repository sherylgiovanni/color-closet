<template>
  <div :key="refresh">
    <div class="center">
      <h1> Color Closet </h1>
    </div>
    <v-dialog
      v-model="dialog"
      width="1000"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          class="edit-button center"
          color="red lighten-2"
          dark
          v-bind="attrs"
          width="200"
          v-on="on"
        >
          Add New
        </v-btn>
      </template>
      <v-card class="card">
        <v-card-title class="text-h5 grey lighten-2">
          Add a new favorite color card
        </v-card-title><br>
        <v-card-text>Enter your name</v-card-text>
        <v-text-field v-model="newStudentName" label="Name" outlined />
        <v-card-text>Enter your BYU ID</v-card-text>
        <v-text-field v-model="newByuId" label="BYU-ID" outlined />
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
          <v-btn
            color="black"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="green"
            text
            @click="addFavoriteColor(); dialog = false"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-flex v-for="student in students" :key="student.name">
      <v-row no-gutters>
        <v-col>
          <FavoriteColorCard :name="student.name" :fav-color="student.favoriteColor" :byu-id="student.byuId" />
        </v-col>
      </v-row>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import VueLogo from '~/components/VueLogo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import { colors } from '~/components/colors'
import me from '~/pages/me.vue'
import FavoriteColorCard from '~/components/FavoriteColorCard.vue'

@Component({
  components: {
    FavoriteColorCard,
    VueLogo,
    VuetifyLogo,
    me
  }
})
export default class IndexPage extends Vue {
  students = []
  colors = colors
  dialog = false
  refresh = 0

  newByuId: string = ''
  newFavColor: string = ''
  newStudentName: string = ''

  async addFavoriteColor () {
    const newEntry = {
      byuId: this.newByuId,
      favoriteColor: this.newFavColor,
      name: this.newStudentName
    }
    await this.$axios.post('https://sg738-fav-color-dev.byu-oit-fullstack-trn.amazon.byu.edu/', newEntry)
    this.$router.go(0) // refresh page
  }

  async mounted () {
    const response = await this.$axios.$get('https://sg738-fav-color-dev.byu-oit-fullstack-trn.amazon.byu.edu/')
    this.students.push.apply(this.students, response)
  }
}
</script>

<style>
.col {
  padding: 14px !important;
}

.center {
  margin: auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
