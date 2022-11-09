<template>
  <div>
    <v-card>
      <v-row class="mx-auto">
        <v-col md="6">
          <div class="GuardingTitle">הוספת אנשים לקבוצה</div>
        </v-col>
        <v-col cols="12">
          <div class="justify-sm-space-around pr-2 pl-2">
            <v-divider></v-divider>
          </div>
        </v-col>
      </v-row>
      <v-row class="mx-auto">
        <v-col md="3">
          <v-autocomplete
            v-model="memberToAdd"
            :items="filteredMembers"
            item-text="name"
            return-object
            outlined
            label="איש צוות"
            dense
          ></v-autocomplete>
        </v-col>
        <v-col md="1">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon @click="newMemberDialog = true" v-bind="attrs" v-on="on"
                >mdi-plus</v-icon
              >
            </template>
            <span>הוספת חבר צוות חדש</span>
          </v-tooltip>
        </v-col>
        <v-col md="7">
          <v-chip-group active-class="primary--text" column>
            <v-chip
              v-for="member in members"
              :key="member.personalNumber"
              class="ma-2"
              @click="openConfirmationDialog(member)"
              >{{ member.name }}</v-chip
            >
          </v-chip-group>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="confirmDialog" max-width="19rem">
      <v-card>
        <v-card-title>למחוק את חבר הצוות מהקבוצה?</v-card-title>
        <v-card-actions>
          <v-btn class="mr-6" color="red" text @click="confirmDialog = false">לא</v-btn>
          <v-spacer />

          <v-btn class="ml-6" color="red" text @click="removeMember()">כן</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="newMemberDialog" max-width="20rem">
      <NewMember
        :allMembers="this.allMembers"
        @add-new-member-to-group="addNewMemberToGroup($event, index)"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import axios from '../plugins/axios';
import { Member } from '../Data/Members';
import NewMember from './NewMember.vue';

export default Vue.extend({
  name: 'EditGroup',
  data() {
    return {
      memberToAdd: {} as Member,
      memberToRemove: {} as Member,
      allMembers: [] as Member[],
      chosenGroupName: '',
      newMemberDialog: false,
      confirmDialog: false,
    };
  },
  components: {
    NewMember,
  },
  computed: {
    filteredMembers: {
      get(): Member[] {
        return this.allMembers.filter(
          (member) =>
            !this.members.some(
              (specMember: Member) => specMember.personalNumber === member.personalNumber
            )
        );
      },
    },
    ...mapGetters(['members']),
  },
  methods: {
    async getAllMembers() {
      return (await axios.get('members'))?.data;
    },
    addNewMemberToGroup(member: Member) {
      this.newMemberDialog = false;
      this.allMembers.push(member);
      this.$store.dispatch('addMember', member);
    },
    removeMember() {
      this.confirmDialog = false;
      this.$store.dispatch('removeMember', this.memberToRemove);
    },
    openConfirmationDialog(member: Member) {
      this.memberToRemove = member;
      this.confirmDialog = true;
    },
  },
  async mounted() {
    this.allMembers = await this.getAllMembers();
  },
  watch: {
    memberToAdd() {
      this.$store.dispatch('addMember', this.memberToAdd);
    },
  },
});
</script>

<style>
.GuardingTitle {
  font-size: 1.5rem;
  margin-bottom: -0.5rem;
  margin-right: 1rem;
}
</style>
