<template>
  <div class="timepicker">
    <v-row>
      <v-col cols="auto">
        <time-field
          :label="label"
          :disabled="disabled"
          v-model="minutes"
          :timeLimit="59"
          @reset="resetMinutes"
          :placeholder="placeholderMinutes"
          :valid="valid"
        />
      </v-col>

      <v-col cols="auto">
        <v-subheader id="divider">:</v-subheader>
      </v-col>

      <v-col cols="auto">
        <time-field
          :disabled="disabled"
          :placeholder="placeholderHours"
          v-model="hours"
          :timeLimit="23"
          @reset="resetHours"
          :valid="valid"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TimeField from './TimeField.vue';

export default Vue.extend({
  name: 'SingleTimePicker',
  components: {
    TimeField,
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: new Date().toString(),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Date,
    },
    valid: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      minutes: new Date(this.value).getMinutes(),
      hours: new Date(this.value).getHours(),
    };
  },
  watch: {
    minutes(): void {
      this.updateTimeModel();
    },
    hours(): void {
      this.updateTimeModel();
    },
  },
  computed: {
    placeholderMinutes(): number {
      return new Date(this.placeholder).getMinutes();
    },
    placeholderHours(): number {
      return new Date(this.placeholder).getHours();
    },
  },
  methods: {
    updateTimeModel() {
      const current = new Date();
      current.setHours(this.hours, this.minutes);
      this.$emit('input', current);
    },
    resetMinutes() {
      this.minutes = new Date().getMinutes();
    },
    resetHours() {
      this.hours = new Date().getHours();
    },
  },
});
</script>

<style scoped>
.col {
  padding: 0;
}
#divider {
  margin-top: 0.4rem;
  font-size: 2.3em;
}
.invalid {
  color: red;
}
</style>
