<template>
  <div class="home">
    <apexchart type="bar" :options="assignmentOptions" :series="assignmentSeries"></apexchart>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { mapGetters } from 'vuex';
import VueApexCharts from 'vue-apexcharts';
import { Mission } from '../Data/Missions';
import { seriesType, memberAssignmentType } from '../Data/apexTypes';

export default Vue.extend({
  name: 'MissionsChart',
  components: {
    apexchart: VueApexCharts,
  },
  props: ['chartOptions'],
  data() {
    return {
      assignmentSeries: [] as seriesType[],
      assignmentOptions: {
        ...this.chartOptions,
        legend: {
          position: 'top',
        },
        title: {
          text: 'תורנויות',
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
    async initAssigmentsCount() {
      this.missionsStructure.forEach(async (mission: Mission) => {
        const memberAssigmentsCount = (
          await axios.get(
            `/missions/${this.currentGroupName}/memberAssigmentsCount/${mission.description}`
          )
        ).data as [memberAssignmentType];
        this.assignmentOptions = {
          ...this.assignmentOptions,
          xaxis: {
            categories: memberAssigmentsCount.map(
              (memberAssignment: memberAssignmentType) => memberAssignment.name
            ),
          },
        };
        this.assignmentSeries.push({
          name: mission.description,
          data: memberAssigmentsCount.map(
            (memberAssignment: memberAssignmentType) => memberAssignment.countMissions
          ),
        });
      });
    },
  },

  async mounted() {
    this.initAssigmentsCount();
  },
});
</script>
