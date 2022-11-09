<template>
  <v-card class="mx-auto" max-width="900">
    <v-row>
      <v-col sm="5" md="5">
        <div class="MissionTitle">
          {{ missionsStructure.description }}
        </div>
      </v-col>
      <v-col sm="5" md="5">
        <DateAndStaffMember
          id="weekly"
          class="mt-2"
          v-if="weeklyMission"
          :occurrence="missionsStructure.type"
          :isMultipleMemberesMission="isMultipleMemberesMission"
          :missionsAccordingToDescriptionAndDate="missionsAccordingToDescription"
          @update-member="updateMember"
        />
      </v-col>
      <v-col sm="2" md="2">
        <div class="d-flex justify-end me-1 mt-1">
          <v-btn icon>
            <v-icon class="d-flex" size="25">mdi-trash-can-outline</v-icon>
          </v-btn>
          <v-btn class="mr-2" id="duplicate" icon>
            <v-icon class="d-flex" size="23">mdi-text-box-multiple-outline</v-icon>
          </v-btn>
          <mission-structure-modal />
        </div>
      </v-col>
    </v-row>
    <div v-if="dailyMission">
      <!-- TODO: check if can change to v-else -->
      <div class="justify-sm-space-around pr-3 pl-3">
        <v-divider></v-divider>
      </div>
      <v-row align="center" class="guardInputAndDate">
        <v-col sm="2" md="2" v-for="(day, index) in dates" :key="index">
          <DateAndStaffMember
            :occurrence="missionsStructure.type"
            :date="day"
            :isMultipleMemberesMission="isMultipleMemberesMission"
            :missionsAccordingToDescriptionAndDate="getMissionsAccordingToDate(day)"
            @update-member="updateMember"
          />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DateAndStaffMember from './DateAndStaffMember.vue';
import { Mission, missionConvertToSend, SpecificWeekMissionIntfc } from '../Data/Missions';
import { filterWeekDates, getWeekDates } from '../Data/Dates';
import MissionStructureModal from './MissionStructureModal.vue';

export default Vue.extend({
  name: 'MissionCard',
  props: {
    missionsStructure: {} as PropType<Mission>,
    firstDay: {} as PropType<Date>,
    oldMissionsWithMembersAccordingToDescription: {
      type: Array as PropType<Array<SpecificWeekMissionIntfc>>,
      default: () => [],
    },
  },
  components: {
    DateAndStaffMember,
    MissionStructureModal,
  },
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      dateModal: false,
      timeFrom: null,
      timeTo: null,
      timeFromModal: false,
      timeToModal: false,
      timeFromMenu: false,
      timeToMenu: false,
    };
  },
  computed: {
    dates(): (Date | undefined)[] {
      const week = getWeekDates(this.firstDay);

      return filterWeekDates(week.slice(0, week.length - 1), this.missionsStructure.days);
    },
    dailyMission(): boolean {
      return this.missionsStructure.type === 'daily';
    },
    weeklyMission(): boolean {
      return this.missionsStructure.type === 'weekly';
    },
    isMultipleMemberesMission(): boolean {
      return this.missionsStructure.isMultipleMembers ?? false;
    },
  },
  methods: {
    updateMember(memberId: string, date: Date, isMultipleMemberesMission: boolean): void {
      const realDate = this.weeklyMission ? this.firstDay : date;
      const mission = missionConvertToSend(this.missionsStructure, realDate, memberId);
      this.$emit('update-missions-to-send', mission, isMultipleMemberesMission);
    },
    getMissionsAccordingToDate(currentDate: Date): Array<SpecificWeekMissionIntfc> {
      return this.oldMissionsWithMembersAccordingToDescription.filter((currMission) => {
        return new Date(currMission.date).getUTCDate() === currentDate.getUTCDate();
      });
    },
  },
});
</script>

<style scoped>
.MissionTitle {
  font-size: 2rem;
  margin-right: 1rem;
}
.guardingDate {
  transform: scale(0.75);
  margin-top: -3.2rem;
}
.guardInputAndDate {
  margin-right: 0.1rem;
}
.timeInput {
  margin-top: -3.3rem;
  transform: scale(0.8);
}
#weekly {
  height: 3rem;
}
</style>
