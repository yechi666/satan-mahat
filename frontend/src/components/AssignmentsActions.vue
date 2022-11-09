<template>
  <v-row>
    <v-spacer></v-spacer>
    <v-col class="d-flex justify-end" sm="1" md="1">
      <v-dialog v-model="deleteAssignmentModal" width="250">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="mb-4"
            fab
            medium
            fixed
            bottom
            color="primary"
            v-bind="attrs"
            v-on="on"
            :loading="deleteLoader"
            :disabled="deleteLoader"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>למחוק את כל הזימונים?</v-card-title>

          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="deleteAll()">כן</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col class="d-flex justify-end" sm="1" md="1">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="ml-7 mb-4"
            fab
            medium
            fixed
            bottom
            color="primary"
            v-bind="attrs"
            v-on="on"
            :loading="sendLoader"
            :disabled="sendLoader"
            @click="send()"
          >
            <v-icon>mdi-email-send-outline</v-icon>
          </v-btn>
        </template>
        <span>שלח זימונים</span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Snackbar',
  props: ['sendLoader', 'deleteLoader'],
  data() {
    return {
      deleteAssignmentModal: false,
    };
  },
  methods: {
    deleteAll() {
      this.$emit('delete-all');
    },
    send() {
      this.$emit('send');
    },
  },
});
</script>
