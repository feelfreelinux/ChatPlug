<template>
  <section>
    <v-layout row wrap>
      <v-flex md5 px-1>
        <ServiceInstanceList :instances="instances" />
      </v-flex>
      <v-flex md7 px-1>
        <nuxt-child />
      </v-flex>
    </v-layout>
  </section>
</template>

<script lang="ts">
import ServiceInstanceList from '~/components/ServiceInstanceList.vue'
import { Component, Vue } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'
import axios from 'axios'
import * as actions from '../store/modules/services/actions.types'

const servicesModule = namespace('services')

@Component({
  components: {
    ServiceInstanceList: ServiceInstanceList as any,
  },
})
export default class extends Vue {
  @servicesModule.Getter('instances') instances
  @servicesModule.Action(actions.LOAD_INSTANCES) loadInstances
  async created() {
    await this.loadInstances()
  }
}
</script>
<style scoped>
</style>
