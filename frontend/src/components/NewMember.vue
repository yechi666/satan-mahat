<template>
  <div class="home">
    <v-card>
      <v-row class="mx-auto">
        <div class="GuardingTitle pa-2">הוספת איש חדש</div>
        <v-col cols="12">
          <div class="justify-sm-space-around pr-2 pl-2">
            <v-divider></v-divider>
          </div>
        </v-col>
      </v-row>
      <v-row class="mx-auto">
        <v-col md="6">
          <v-text-field
            v-model="newMember.name"
            outlined
            clearable
            label="שם מלא"
            hide-no-data
            hide-details
            dense
          ></v-text-field>
        </v-col>
        <v-col md="6">
          <v-text-field
            :rules="[newMemberRules]"
            v-model="newMember.personalNumber"
            outlined
            clearable
            label="מספר אישי"
            dense
          ></v-text-field>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn color="primary" text @click="addMember()">הוספה</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Member } from '../Data/Members';

export default Vue.extend({
  name: 'NewMember',
  data() {
    return {
      memberToAdd: {} as Member,
      newMember: {} as Member,
      newMemberRules: (value: string) => /^[0-9]{7}$/.test(value) || 'מספר אישי שגוי',
    };
  },
  props: {
    allMembers: Array as () => Member[],
    dialogProp: Boolean,
  },
  methods: {
    addMember() {
      if (this.newMemberRules(this.newMember.personalNumber) !== 'מספר אישי שגוי') {
        this.$emit('add-new-member-to-group', this.newMember);
      }
    },
  },
});
</script>

<style scoped>
.GuardingTitle {
  font-size: 1.5rem;
  margin-bottom: -0.5rem;
  margin-right: 1rem;
}
</style>
