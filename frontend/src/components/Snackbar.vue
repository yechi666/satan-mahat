<template>
  <v-snackbar
    :value="snackbar"
    @input="closeSnackbar"
    :timeout="3000"
    left
    bottom
    :color="color"
  >
    {{ this.msg }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="closeSnackbar"> סגור </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Snackbar',
  props: {
    snackbar: {
      type: Boolean,
      default: false,
    },
    msg: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'green lighten-1',
    },
  },
  computed: {
    snackBarChangable: {
      get(): boolean {
        return this.snackbar;
      },
      set(): void {
        this.$emit('close-snackbar');
      },
    },
  },
  methods: {
    closeSnackbar(): void {
      this.$emit('close-snackbar');
    },
  },
});
</script>
