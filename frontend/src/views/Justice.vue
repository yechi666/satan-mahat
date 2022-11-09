<template>
  <div class="home">
    <v-row>
      <v-col md="8" offset-md="2">
        <guardingChart :chartOptions="this.chartOptions" />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="8" offset-md="2">
        <missionsChart :chartOptions="this.chartOptions" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import missionsChart from '../components/MissionsChart.vue';
import guardingChart from '../components/GuardingChart.vue';
import { chartContextType, configType, seriesItemType } from '../Data/apexTypes';

export default Vue.extend({
  name: 'Home',
  components: {
    guardingChart,
    missionsChart,
  },
  data: () => ({
    chartOptions: {
      theme: {
        mode: 'dark',
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [] as string[],
      },
      yaxis: {
        labels: {
          formatter: (value: Number) => {
            return value.toFixed(0);
          },
        },
      },
      tooltip: {
        y: {
          formatter: (value: Number) => {
            return value.toFixed(1);
          },
        },
      },
      chart: {
        height: 350,
        events: {
          legendClick: (
            chartContext: chartContextType,
            seriesIndex: number,
            config: configType
          ) => {
            config.config.series.forEach((seriesItem: seriesItemType, index: number) => {
              if (index !== seriesIndex) {
                chartContext.hideSeries(seriesItem.name);
              }
            });
          },
        },
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
    },
  }),
});
</script>
