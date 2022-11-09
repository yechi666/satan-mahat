<template>
  <div>
    <div v-if="date !== undefined || weeklyMission">
      <div v-if="dailyMission">
        <strong>יום {{ day }}</strong>
        {{ subDate }}
      </div>
      <div class="d-flex flex-column">
        <v-autocomplete
          class="staffInput"
          label="איש צוות"
          outlined
          :items="members"
          dense
          :multiple="isMultipleMemberesMission"
          item-text="name"
          v-model="memberName"
        ></v-autocomplete>
      </div>
    </div>
    <!-- TODO: check if can change to v-else -->
    <div id="noDate" v-if="date === undefined && dailyMission">אין זימון ביום הזה</div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapGetters } from 'vuex';
import { MissionTypes, SpecificWeekMissionIntfc } from '../Data/Missions';
import { daysNames } from '../Data/Dates';
import { FullMember } from '../Data/Members';

export default Vue.extend({
  name: 'DateAndStaffMember',
  props: {
    date: {} as PropType<Date>,
    occurrence: {} as PropType<MissionTypes>,
    isMultipleMemberesMission: Boolean,
    missionsAccordingToDescriptionAndDate: {
      type: Array as PropType<Array<SpecificWeekMissionIntfc>>,
      default: () => [],
    },
  },
  data() {
    return {
      days: daysNames as string[],
    };
  },
  computed: {
    ...mapGetters(['members']),
    day(): string {
      if (this.date !== undefined) {
        return this.days[this.date.getDay()];
      }

      return '';
    },
    memberName(): string[] | string {
      return this.missionsAccordingToDescriptionAndDate.length > 1
        ? this.missionsAccordingToDescriptionAndDate.map((member) => member.name)
        : this.missionsAccordingToDescriptionAndDate[0]?.name;
    },
    subDate(): string {
      if (this.date !== undefined) {
        return `${this.date.toISOString().substr(8, 2)}/${this.date
          .toISOString()
          .substr(5, 2)}`;
      }

      return '';
    },
    missionMembers(): FullMember[] {
      const fullMembers = (this.members as FullMember[]).filter((currMember) =>
        this.memberName.includes(currMember.name)
      );

      return fullMembers !== undefined ? fullMembers : ({} as FullMember[]);
    },
    dailyMission(): boolean {
      return this.occurrence === 'daily';
    },
    weeklyMission(): boolean {
      return this.occurrence === 'weekly';
    },
  },
  watch: {
    memberName() {
      this.updateMember();
    },
  },
  methods: {
    updateMember(): void {
      this.missionMembers.forEach((member) =>
        this.$emit(
          'update-member',
          member.personalNumber,
          this.date,
          this.isMultipleMemberesMission
        )
      );
    },
  },
});
</script>

<style scoped>
.staffInput {
  width: 7rem;
}
#noDate {
  padding-bottom: 1rem;
}
</style>
