<template>
  <div class="mr-7 pl-2">
    <v-row class="p-0">
      <v-col cols="auto">
        <single-time-picker
          :placeholder="placeholder.startTime"
          :disabled="disabled"
          v-model="start"
          :valid="isTimeValid"
          label="מ..."
        />
      </v-col>

      <v-col cols="auto">
        <v-subheader id="divider">-</v-subheader>
      </v-col>

      <v-col cols="auto">
        <single-time-picker
          :placeholder="placeholder.endTime"
          :disabled="disabled"
          v-model="end"
          :valid="isTimeValid"
          label="עד"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SingleTimePicker from './SingleTimePicker.vue';

export default Vue.extend({
  name: 'FullTimePicker',
  components: {
    SingleTimePicker,
  },
  props: {
    placeholder: {
      type: Object,
      default: () => ({
        startTime: new Date().toString(),
        endTime: new Date().toString(),
      }),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
    },
    date: {
      type: Date,
      default: () => (new Date()),
    },
    isValid: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      start: this.value.start,
      end: this.value.end,
    };
  },
  watch: {
    start(): void {
      this.updateTimeModel();
    },
    end(): void {
      this.updateTimeModel();
    },
  },
  computed: {
    isTimeValid(): boolean {
      const resetBeginningDay = (date: Date) => date.setHours(0, 0, 0, 0);
      const dateAfterToday = (date: Date) =>
        resetBeginningDay(new Date()) < resetBeginningDay(date);

      const currentTime = new Date().setSeconds(0);
      const endTime = new Date(this.end).setSeconds(0);
      const startTime = new Date(this.start).setSeconds(0);

      if (this.date !== null && dateAfterToday(new Date(this.date!))) {
        const valid = startTime < endTime;
        this.$emit('update:isValid', valid);

        return valid;
      }

      const valid = startTime < endTime && startTime > currentTime;
      this.$emit('update:isValid', valid);

      return valid;
    },
  },
  methods: {
    updateTimeModel() {
      this.$emit('input', {
        start: this.start,
        end: this.end,
      });
    },
  },
});
</script>

<style scoped>
#divider {
  margin-top: 0.4rem;
  font-size: 2.3em;
}
.timePickerStartEnd {
  margin-right: 4vw;
}
</style>
