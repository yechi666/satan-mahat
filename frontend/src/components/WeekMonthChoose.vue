<template>
  <div>
    <v-row class="mx-auto">
      <v-col md="11" offset-md="1">
        <v-btn icon id="next" @click="moveToNextWeek()">
          <v-icon class="d-flex" size="25">mdi-play</v-icon>
        </v-btn>
        <v-btn icon id="back" @click="moveToLastWeek()">
          <v-icon class="leftIcon" size="25">mdi-play</v-icon>
        </v-btn>
        {{ this.currWeek.display }}
        <v-icon>mdi-calendar-week</v-icon>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getCurrWeek, getLastWeek, getNextWeek, Week } from '../Data/Dates';

export default Vue.extend({
  name: 'WeekMonthChoose',
  data() {
    return {
      currWeek: {} as Week,
    };
  },
  methods: {
    moveToNextWeek(): void {
      this.currWeek = getNextWeek(this.currWeek);
    },
    moveToLastWeek(): void {
      this.currWeek = getLastWeek(this.currWeek);
    },
  },
  mounted() {
    this.currWeek = getCurrWeek();
  },
  watch: {
    currWeek(newVal: Week) {
      this.$emit('update-week', newVal);
    },
  },
});
</script>

<style scoped>
.staffInput {
  width: 7rem;
}
.leftIcon {
  transform: scaleX(-1);
}
</style>
