<template>
  <v-hover v-slot="{ hover }">
    <v-card class="mx-auto roundedCard" max-width="340" elevation="7">
      <v-row class="avatarRow ma-0" justify="end">
        <GuardingCardButton
          :icon="sendingButton.icon"
          :tooltip="sendingButton.tooltip"
          :hover="hover"
          @icon-action="resendGuarding()"
        />
        <GuardingCardButton
          :icon="duplicatingButton.icon"
          :tooltip="duplicatingButton.tooltip"
          :hover="hover"
          @icon-action="addGuarding()"
        />
        <v-col class="d-flex justify-end" sm="1" md="1">
          <v-dialog v-model="deleteGuardingModal" width="220">
            <template v-slot:activator="{ on, attrs }">
              <v-avatar
                v-bind="attrs"
                v-on="on"
                color="primary"
                size="20"
                class="deleteAvatar"
                :style="[hover ? { opacity: '1' } : { opacity: '0' }]"
              >
                <v-icon size="12">mdi-close</v-icon>
              </v-avatar>
            </template>
            <v-card>
              <v-card-title>למחוק את השמירה?</v-card-title>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="removeGuarding()">כן</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="7" md="7">
          <v-menu
            left
            v-model="dateModal"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="guardingDate"
                v-model="guardingDate"
                label="תאריך"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="guardingDate" @input="dateModal = false"></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>

      <FullTimePicker class="timePicker" :date="new Date(guardingProp.date)" :isValid.sync="isTimeValid" v-model="fullTime" />

      <v-row class="guardInput">
        <v-col sm="8" md="11">
          <v-autocomplete
            v-model="guardingMember"
            :items="members"
            item-text="name"
            return-object
            outlined
            label="איש סגל"
            hide-no-data
            hide-details
            dense
          ></v-autocomplete>
        </v-col>
      </v-row>
    </v-card>
  </v-hover>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { Member } from '../Data/Members';
import { Activity } from '../Data/Missions';
import GuardingCardButton from './GuardingCardButton.vue';
import FullTimePicker from './TimePicker/FullTimePicker.vue';

export default Vue.extend({
  name: 'GuardingCard',
  components: {
    FullTimePicker,
    GuardingCardButton,
  },
  props: {
    guardingProp: {} as () => Activity,
  },
  data() {
    return {
      sendingButton: { tooltip: 'שינוי שמירה', icon: 'mdi-email-sync-outline' },
      duplicatingButton: { tooltip: 'שכפול', icon: 'mdi-content-duplicate' },
      deleteGuardingModal: false,
      menu: false,
      modal: false,
      dateModal: false,
      isTimeValid: true,
      fullTime: {
        start: new Date(),
        end: new Date(),
      },
    };
  },
  methods: {
    outWheel(event: WheelEvent) {
      event.preventDefault();
    },
    updateGuarding(newGuarding: Activity) {
      this.guarding = newGuarding;
    },
    changeDate(newDate: Date) {
      const newGuarding = { ...this.guarding, date: newDate };
      this.updateGuarding(newGuarding);
    },
    changeMember(groupMemberId: string) {
      const newGuarding = { ...this.guarding, groupMemberId };
      this.updateGuarding(newGuarding);
    },
    addGuarding() {
      this.$emit('add-guarding');
    },
    removeGuarding() {
      this.deleteGuardingModal = false;
      this.$emit('remove-guarding');
    },
    resendGuarding() {
      this.$emit('resend-guarding');
    },
  },
  computed: {
    ...mapGetters(['members']),

    guarding: {
      get(): Activity {
        return this.guardingProp;
      },
      set(newGuarding: Activity): void {
        this.$emit('update-guarding', newGuarding);
      },
    },
    guardingDate: {
      get() {
        return new Date(this.guardingProp.date).toISOString().substr(0, 10);
      },
      set(newDate: string): void {
        this.changeDate(new Date(newDate));
      },
    },
    guardingMember: {
      get() {
        return this.members.find(
          (currMember: Member) => currMember.personalNumber === this.guardingProp.groupMemberId
        );
      },
      set(member: Member): void {
        this.changeMember(member.personalNumber);
      },
    },
  },
  watch: {
    member(val: Member) {
      this.changeMember(val?.personalNumber);
    },
    fullTime() {
      const newGuarding = {
        ...this.guarding,
        time: {
          startHour: this.fullTime.start.getHours(),
          startMinute: this.fullTime.start.getMinutes(),
          endHour: this.fullTime.end.getHours(),
          endMinute: this.fullTime.end.getMinutes(),
        },
      };
      this.updateGuarding(newGuarding);
    },
  },
});
</script>
<style scoped>
.guardingDate {
  margin-right: 2rem;
  margin-top: -3.2rem;
}
.guardInput {
  margin-top: -3.2rem;
  margin-right: 0.1rem;
}
.timePicker {
  margin-top: -2.3rem;
  margin-bottom: 2.3rem;
  margin-right: 1.3rem;
}
.roundedCard {
  border-radius: 15px;
}
</style>
