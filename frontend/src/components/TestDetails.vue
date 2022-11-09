<template>
  <v-card class="roundedCard">
    <v-row class="mx-auto">
      <v-col md="5">
        <div class="GuardingTitle">הוספת שמירות</div>
      </v-col>
      <v-col cols="12">
        <div class="justify-sm-space-around pr-2 pl-2">
          <v-divider></v-divider>
        </div>
      </v-col>
    </v-row>
    <v-row class="mx-auto">
      <v-col md="4">
        <v-autocomplete
          :rules="rules"
          outlined
          hide-no-data
          hide-details
          dense
          append-icon="mdi-text"
          v-model="chosenTest"
          return-object
          :items="tests"
          placeholder="תרצ..."
          label="תיאור השמירה"
        ></v-autocomplete>
      </v-col>
      <v-col md="4">
        <v-text-field
          :rules="rules"
          label="מיקום"
          placeholder="כיתה..."
          outlined
          hide-no-data
          dense
          append-icon="mdi-map-marker"
          v-model="place"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { getRootByMegama, getMegamaByPersonalNumber, getTestNames } from '../queries/tests';

type ruleFunc = (value: string) => true | string;

export default Vue.extend({
  name: 'TestDetails',
  data() {
    return {
      chosenTest: {} as string,
      tests: [] as string[],
      rules: [(value) => Boolean(value && value.length) || 'Required'] as ruleFunc[],
    };
  },
  watch: {
    chosenTest() {
      if (this.chosenTest) {
        this.$emit('change-test', this.chosenTest);
      }
    },
  },
  props: { placeProp: {} as () => string },
  computed: {
    ...mapGetters(['user']),
    place: {
      get(): string {
        return this.placeProp;
      },
      set(newPlace: string): void {
        this.$emit('change-place', newPlace);
      },
    },
  },
  async created() {
    await this.getAllTests();
  },
  methods: {
    async getAllTests(): Promise<void> {
      const megama = await this.$apollo.query({
        query: getMegamaByPersonalNumber,
        variables: {
          soldier_id: this.user.personalNumber,
        },
      });
      const root = await this.$apollo.query({
        query: getRootByMegama,
        variables: {
          megama_id: megama.data.userDetailsBySoldierId[0].assignments[0].megama_id,
        },
      });
      const tests = await this.$apollo.query({
        query: getTestNames,
        variables: {
          root_id: root.data.api_all_tree_roots[0].id,
        },
      });
      type test = { parent_milestone: { name: string }; name: string };
      this.tests = tests.data.testList
        .sort((a: test, b: test) =>
          a.parent_milestone.name < b.parent_milestone.name ? 1 : -1
        )
        .map((test: test) => `${test.name} ${test.parent_milestone.name}`);
    },
  },
});
</script>
<style scoped>
.GuardingTitle {
  font-size: 2rem;
  margin-bottom: -0.5rem;
  margin-right: 1rem;
}
</style>
