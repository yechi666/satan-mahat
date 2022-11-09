<template>
  <div class="home">
    <v-card>
      <v-row class="mx-auto">
        <div class="GuardingTitle pa-2">הוספת קבוצה חדשה</div>
        <v-col cols="12">
          <div class="justify-sm-space-around pr-2 pl-2">
            <v-divider></v-divider>
          </div>
        </v-col>
      </v-row>
      <v-row class="mx-auto pr-3">
        <v-col md="7">
          <v-text-field
            v-model="groupName"
            outlined
            clearable
            label="שם קבוצה"
            hide-no-data
            hide-details
            dense
          ></v-text-field>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="addGroup">הוספה</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NewMember',
  data() {
    return {
      groupName: '',
    };
  },
  methods: {
    addGroup() {
      this.$emit('add-new-group', this.groupName);
    },
  },
});
</script>

<style scoped>
.GuardingTitle {
  font-size: 1.5rem;
  margin-bottom: -0.5rem;
}
</style>
