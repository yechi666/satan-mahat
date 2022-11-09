<template>
  <div>
    <v-menu
      ref="dateMenu"
      v-model="dateMenu"
      :close-on-content-click="false"
      :return-value.sync="date"
      :disabled="!isEditable"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="date"
          label="תאריך ההסתייגות"
          prepend-icon="mdi-calendar"
          :placeholder="placeholder.date"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="date" no-title scrollable>
        <v-spacer />
        <v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
        <v-btn text color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn>
      </v-date-picker>
    </v-menu>

    <full-time-picker 
      :placeholder="{
        startTime: placeholder.startTime,
        endTime: placeholder.endTime,
      }"
      :disabled="!isEditable"
      v-model="fullTime"
      :isValid.sync="isTimeValid"
      :date="date"
      />

    <v-text-field
      required
      label="סיבה"
      :placeholder="placeholder.description"
      v-model="reason"
      :disabled="!isEditable"
    ></v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Reservation } from '../../Data/Reservation';
import FullTimePicker from '../TimePicker/FullTimePicker.vue';

export default Vue.extend({
  name: 'ReservationCard',
  components: { FullTimePicker },
  props: {
    placeholder: {
      type: Object,
      default: () => ({
        date: '',
        startTime: new Date().toString(),
        endTime: new Date().toString(),
        description: '',
      }),
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    isFormValid: {
      type: Boolean,
      default: false,
    },
    isEditable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      date: null,
      dateMenu: false,
      fullTime: {
        start: new Date(),
        end: new Date(),
      },
      isTimeValid: false,
      reason: '',
    };
  },
  watch: {
    isEditable() {
      this.date = this.isEditable ? this.placeholder.date : '';
      this.reason = this.isEditable ? this.placeholder.description : '';
      this.fullTime = this.isEditable
        ? { start: this.placeholder.startTime, end: this.placeholder.endTime }
        : { start: new Date(), end: new Date() };
    },
    date() {
      this.updateInputReservation({ date: this.date! });
    },
    fullTime() {
      this.updateInputReservation({
        startTime: this.fullTime.start,
        endTime: this.fullTime.end,
      });
    },
    reason() {
      this.updateInputReservation({
        description: this.reason,
      });
    },
  },
  methods: {
    updateInputReservation(updateReservation: Partial<Reservation>) {
      this.$emit('input', {
        ...this.value,
        ...updateReservation,
      });
      this.$emit('update:isFormValid', this.isValidInputs);
    },
  },
  computed: {
    isValidInputs(): boolean {
      return this.reason !== '' && this.isDateValid && this.isTimeValid;
    },
    isDateValid(): boolean {
      const resetBeginningDay = (date: Date) => date.setHours(0, 0, 0, 0);

      return (
        this.date !== null &&
        resetBeginningDay(new Date(this.date!)) >= resetBeginningDay(new Date())
      );
    },
  },
});
</script>
