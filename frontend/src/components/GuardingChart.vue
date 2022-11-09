<template>
  <div class="home">
    <apexchart type="bar" :options="guardingOptions" :series="guardingSeries"></apexchart>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import VueApexCharts from 'vue-apexcharts';
import { seriesType, memberGuardingType } from '../Data/apexTypes';

export default Vue.extend({
  name: 'GuardingChart',
  components: {
    apexchart: VueApexCharts,
  },
  props: ['chartOptions'],
  data() {
    return {
      guardingSeries: [] as seriesType[],
      assignmentSeries: [] as seriesType[],
      guardingOptions: {
        ...this.chartOptions,
        legend: {
          show: false,
        },
        title: {
          text: 'שמירות',
          align: 'center',
          margin: 40,
          offsetY: 4,
          floating: true,
          style: {
            fontSize: '1.2rem',
          },
        },
      },
    };
  },
  computed: {
    ...mapGetters(['currentGroupName', 'missionsStructure']),
  },
  methods: {
    async initGuardingCount() {
      const membersGuardingCount = (
        await axios.get(`/missions/${this.currentGroupName}/guarding/time`)
      ).data as [memberGuardingType];

      this.guardingSeries.push({
        data: membersGuardingCount.map(
          (memberGuarding: memberGuardingType) => memberGuarding.totalHours
        ),
        name: 'שעות',
      });

      this.guardingOptions = {
        ...this.guardingOptions,
        xaxis: {
          categories: membersGuardingCount.map(
            (memberGuarding: memberGuardingType) => memberGuarding._id
          ),
        },
      };
    },
  },

  async mounted() {
    this.initGuardingCount();
  },
});
</script>
