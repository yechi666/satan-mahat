<template>
  <v-text-field
    class="clockElement"
    justify-center
    :placeholder="placeholderFormatted"
    flat
    v-model="timeFormatted"
    maxlength="2"
    :disabled="disabled"
    @wheel="changeTime"
    :rules="[valid]"
    :label="label"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TimeField',
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Number,
    },
    timeLimit: {
      type: Number,
      required: true,
    },
    valid: {
      type: Boolean,
      default: true
    },
    errorMassage: {
      type: String,
      default: ''
    }
  },
  data() {
    return { time: this.value };
  },
  watch: {
    value() {
      this.time = this.value;
    },
  },
  computed: {
    timeFormatted: {
      get(): string {
        if (this.time === undefined || this.time === null || this.disabled) {
          return this.placeholderFormatted;
        }

        return this.formatTime(this.time);
      },
      set(newTime: number): void {
        if (newTime === undefined) {
          this.$emit('reset');
        }

        this.time = newTime;
      },
    },
    placeholderFormatted(): string {
      return this.formatTime(this.placeholder);
    },
  },
  methods: {
    formatTime(time: number) {
      return time === 0 ? '00' : time.toString().padStart(2, '0');
    },
    changeTime(event: WheelEvent): void {
      event.preventDefault();
      if (this.time === undefined) {
        this.time = this.value;
      } else {
        let newTime = this.time;
        newTime += event?.deltaY * -0.01;
        newTime %= this.timeLimit;
        this.time = newTime < 0 ? this.timeLimit : newTime;
        this.$emit('input', this.time);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.clockElement {
  font-size: 1.5em;
  font-weight: bold;
  width: 1.3em;
}
</style>
