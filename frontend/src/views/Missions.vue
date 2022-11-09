<template>
  <v-div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <WeekMonthChoose @update-week="updateFirstDay" />
        </v-col>
        <v-col
          cols="12"
          v-for="(structure, index) in missionsStructure"
          :key="oldMissionsWithMembers[index]"
        >
          <MissionCard
            :missionsStructure="structure"
            :firstDay="firstDay"
            @update-missions-to-send="updateMissionsToSend"
            :oldMissionsWithMembersAccordingToDescription="
              getMissionsAccordingToDescription(structure.description)
            "
          />
        </v-col>
        <v-col cols="12" class="d-flex justify-center mb-6">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="mx-2" fab dark v-bind="attrs" v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>הוספת מבנה תורנות חדש</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>

    <snackbar
      :snackbar="snackbar"
      :msg="snackbarObj.msg"
      :color="snackbarObj.color"
      @close-snackbar="closeSnackbar"
    />
    <AssignmentsActions
      :sendLoader="sendLoader"
      :deleteLoader="deleteLoader"
      @send="sendMissions()"
      @delete-all="deleteAllMissions()"
    />
  </v-div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import axios from '../plugins/axios';
import MissionCard from '../components/MissionCard.vue';
import WeekMonthChoose from '../components/WeekMonthChoose.vue';
import Snackbar from '../components/Snackbar.vue';
import { Week } from '../Data/Dates';
import AssignmentsActions from '../components/AssignmentsActions.vue';
import {
  isMissionAlreadyExist,
  MissionToSend,
  isMemberAlreadyExistsInMission,
  SpecificWeekMissionIntfc,
} from '../Data/Missions';

export default Vue.extend({
  name: 'Missions',
  components: {
    MissionCard,
    WeekMonthChoose,
    Snackbar,
    AssignmentsActions,
  },
  data() {
    return {
      firstDay: new Date(),
      missionsToSend: [] as MissionToSend[],
      snackbar: false,
      snackbarObj: {
        msg: '',
        color: '',
      },
      sendLoader: false,
      deleteLoader: false,
      oldMissionsWithMembers: [] as SpecificWeekMissionIntfc[],
    };
  },
  async created() {
    try {
      this.oldMissionsWithMembers = (
        await axios.get(`missions/${this.currentGroupName}/old/${this.firstDay}`)
      ).data as SpecificWeekMissionIntfc[];
    } catch {
      this.openSnackBar('שגיאה בטעינת השמירות...', 'red lighten-1');
    }
  },
  computed: {
    ...mapGetters(['missionsStructure', 'currentGroupName']),
  },
  methods: {
    // TODO: CREATE A FUNCTION THAT RETURNS THE GROUP
    async updateFirstDay(newVal: Week): Promise<void> {
      this.firstDay = newVal.firstDay;

      try {
        this.oldMissionsWithMembers = (
          await axios.get(`missions/${this.currentGroupName}/old/${this.firstDay}`)
        ).data;
      } catch {
        this.openSnackBar('שגיאה בטעינת השמירות...', 'red lighten-1');
      }
    },
    updateMissionsToSend(mission: MissionToSend, isMultipleMemberesMission: boolean): void {
      const updatesMission = this.missionsToSend.find(
        (currMission) =>
          !isMultipleMemberesMission && isMissionAlreadyExist(mission, currMission)
      );

      // TODO: check how to convert to ternary
      if (isMultipleMemberesMission) {
        const isEventExists = this.missionsToSend.find((currMission) =>
          isMemberAlreadyExistsInMission(mission, currMission)
        );

        if (!isEventExists) {
          this.missionsToSend.push(mission);
        }
      } else if (updatesMission) {
        updatesMission.groupMemberId = mission.groupMemberId;
      } else {
        this.missionsToSend.push(mission);
      }
    },
    async sendMissions(): Promise<void> {
      this.sendLoader = true;

      try {
        const response = await axios.put(
          `missions/${this.currentGroupName}/schedulingMissions`,
          this.missionsToSend
        );
        this.openSnackBar(response.data, 'green lighten-1');
      } catch {
        this.openSnackBar('שגיאה בשליחת השמירות...', 'red lighten-1');
      } finally {
        this.sendLoader = false;
      }
    },
    async deleteAllMissions() {
      this.deleteLoader = true;

      try {
        // TODO: add request to server to delete all missions to send from db
        const response = { data: 'המשימות נמחקו בהצלחה!' };
        this.missionsToSend = [];
        this.openSnackBar(response.data, 'green lighten-1');
      } catch {
        this.openSnackBar('שגיאה בשליחת המשימות...', 'red lighten-1');
      } finally {
        this.deleteLoader = false;
      }
    },
    openSnackBar(msg: string, color: string): void {
      this.snackbarObj.msg = msg;
      this.snackbarObj.color = color;
      this.snackbar = true;
    },
    closeSnackbar(): void {
      this.snackbarObj.msg = '';
      this.snackbarObj.color = '';
      this.snackbar = false;
    },
    getMissionsAccordingToDescription(description: String): Array<SpecificWeekMissionIntfc> {
      return this.oldMissionsWithMembers.filter((currMission) => {
        return currMission.description === description;
      });
    },
  },
});
</script>
