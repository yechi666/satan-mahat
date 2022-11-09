<template>
  <div class="home">
    <v-form ref="form" v-model="validTestDetails">
      <v-row id="container">
        <v-col cols="10" offset-md="1">
          <TestDetails
            :placeProp="this.testGuardings.place"
            @change-place="changePlace($event)"
            @change-test="changeTest($event)"
          />
        </v-col>

        <v-col cols="10" offset-md="1">
          <v-row>
            <v-col cols="4" v-for="(currGuarding, index) in guardings" :key="index">
              <GuardingCard
                :guardingProp="currGuarding"
                :members="members"
                @update-guarding="updateGuarding($event, index)"
                @add-guarding="duplicateGuarding(currGuarding, index)"
                @resend-guarding="resendGuarding(currGuarding)"
                @remove-guarding="removeGuarding(index)"
              />
            </v-col>
            <v-col cols="4">
              <v-card class="roundedCard pa-6" elevation="7">
                <center>
                  <v-btn icon dark x-large class="mx-5 my-11" @click="plusGuarding()">
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                </center>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <AssignmentsActions
        :sendLoader="sendLoader"
        :deleteLoader="deleteLoader"
        @send="sendGuardings()"
        @delete-all="deleteAllGuardings()"
      />
    </v-form>
    <snackbar
      :snackbar="snackbar"
      :msg="snackbarObj.msg"
      :color="snackbarObj.color"
      @close-snackbar="closeSnackbar"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import axios from '../plugins/axios';
import GuardingCard from '../components/GuardingCard.vue';
import AssignmentsActions from '../components/AssignmentsActions.vue';
import TestDetails from '../components/TestDetails.vue';
import Snackbar from '../components/Snackbar.vue';
import { TestGuarding } from '../Data/Guards';
import { Activity } from '../Data/Missions';
import { Member } from '../Data/Members';
import { checkIfTimeValid } from '../PublicFiles/Methods';

export default Vue.extend({
  name: 'Guards',
  data() {
    return {
      testGuardings: {} as TestGuarding,
      members: [] as Member[],
      validTestDetails: false as boolean,
      snackbar: false,
      snackbarObj: {
        msg: '',
        color: '',
      },
      sendLoader: false,
      deleteLoader: false,
    };
  },
  components: {
    GuardingCard,
    Snackbar,
    AssignmentsActions,
    TestDetails,
  },
  watch: {
    members(newMembers) {
      this.members = newMembers[0].members;
    },
  },
  mounted() {
    (this.$refs.form as Vue & { validate: () => boolean }).validate();
  },
  async created() {
    this.testGuardings = {
      title: '',
      place: '',
      guardings: [
        {
          date: new Date(),
          time: { startHour: 8, startMinute: 0, endHour: 8, endMinute: 45 },
          groupMemberId: '',
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['currentGroupName', 'user']),
    guardings: {
      get(): Activity[] {
        return this.testGuardings.guardings;
      },
      set(newGuardings: Activity[]): void {
        this.testGuardings.guardings = newGuardings;
      },
    },
  },
  methods: {
    clearGuardingsArr() {
      this.guardings.splice(0);
      this.guardings.push({
        date: new Date(),
        time: { startHour: 8, startMinute: 0, endHour: 8, endMinute: 45 },
        groupMemberId: '',
      });
    },
    updateGuarding(newGuarding: Activity, index: number): void {
      this.$set(this.guardings, index, { ...newGuarding });
    },
    duplicateGuarding(currentGuarding: Activity, index: number): void {
      const newGuarding = JSON.parse(JSON.stringify(currentGuarding));
      this.guardings.splice(index + 1, 0, newGuarding);
    },
    plusGuarding(): void {
      this.addGuarding(this.guardings[this.guardings.length - 1], this.guardings.length - 1);
    },
    addGuarding(currentGuarding: Activity, index: number): void {
      const difference = this.minutesDifference(
        currentGuarding.time.startHour,
        currentGuarding.time.startMinute,
        currentGuarding.time.endHour,
        currentGuarding.time.endMinute
      );
      const newGuarding = JSON.parse(JSON.stringify(currentGuarding));
      this.getNewTimeWithDifference(difference, newGuarding);
      newGuarding.groupMemberId = null;
      this.guardings.splice(index + 1, 0, newGuarding);
    },
    changeTest(newTitle: string) {
      this.testGuardings.title = newTitle;
      this.getOldGuardings();
    },
    changePlace(newPlace: string) {
      this.testGuardings.place = newPlace;
    },
    async deleteAllGuardings() {
      this.deleteLoader = true;

      try {
        const response = await axios.put(
          `missions/${this.currentGroupName}/deleteMultipleGuardings`,
          this.testGuardings.guardings
        );
        this.clearGuardingsArr();
        this.openSnackBar(response.data, 'green lighten-1');
      } catch {
        this.openSnackBar('שגיאה בשליחת השמירות...', 'red lighten-1');
      } finally {
        this.deleteLoader = false;
      }
    },
    async getOldGuardings() {
      try {
        const oldMissions = await (
          await axios.get(
            `missions/${this.currentGroupName}/guardings/${this.testGuardings.title}`
          )
        ).data;
        this.clearGuardingsArr();

        this.testGuardings.place = oldMissions[0]?.place;
        oldMissions.forEach(
          (
            currGuarding: {
              member: string;
              personalNumber: string;
              startDate: Date;
              endDate: Date;
              eventId: string;
            },
            index: number
          ) => {
            const startDate = new Date(currGuarding.startDate);
            const endDate = new Date(currGuarding.endDate);
            const newGuarding = {
              date: startDate,
              time: {
                startHour: startDate.getHours(),
                startMinute: startDate.getMinutes(),
                endHour: endDate.getHours(),
                endMinute: endDate.getMinutes(),
              },
              groupMemberId: currGuarding.member,
              eventId: currGuarding.eventId,
            };
            this.updateGuarding(newGuarding, index);
          }
        );
      } catch {
        this.openSnackBar('לא זומנו שמירות עבור תרצ זה', 'red lighten-1');
        this.clearGuardingsArr();
      }
    },
    async resendGuarding(guarding: Activity): Promise<void> {
      try {
        const response = await axios.put(
          `missions/${this.currentGroupName}/updateGuarding`,
          guarding
        );
        this.openSnackBar(response.data, 'green lighten-1');
      } catch {
        this.openSnackBar('שגיאה בעדכון השמירה...', 'red lighten-1');
      }
    },
    async removeGuarding(index: number): Promise<void> {
      try {
        const response = await axios.put(
          `missions/${this.currentGroupName}/deleteGuarding`,
          this.testGuardings.guardings[index]
        );

        this.guardings.splice(index, 1);
        this.openSnackBar(response.data, 'green lighten-1');
      } catch (error) {
        if (error.response.status === 304) {
          this.guardings.splice(index, 1);
          this.openSnackBar('שמירה עדיין לא זומנה...', 'red lighten-1');
        } else {
          this.openSnackBar('שגיאה במחיקת השמירות...', 'red lighten-1');
        }
      }
      if (this.guardings.length === 0) {
        this.guardings.push({
          date: new Date(),
          time: { startHour: 8, startMinute: 0, endHour: 8, endMinute: 45 },
          groupMemberId: '',
        });
      }
    },
    async sendGuardings(): Promise<void> {
      (this.$refs.form as Vue & { validate: () => boolean }).validate();
      if (this.isTestGuardingsValid()) {
        this.sendLoader = true;

        try {
          const response = await axios.put(
            `missions/${this.currentGroupName}/schedulingGurading`,
            this.testGuardings
          );
          this.openSnackBar('השמירות נשלחו בהצלחה', 'green lighten-1');
          response.data.forEach(
            (memberGuarding: { assignment: { eventId: string } }, index: number) => {
              this.updateGuarding(
                {
                  date: this.guardings[index].date,
                  time: this.guardings[index].time,
                  groupMemberId: this.guardings[index].groupMemberId,
                  eventId: memberGuarding.assignment.eventId,
                },
                index
              );
            }
          );
        } catch {
          this.openSnackBar('שגיאה בשליחת השמירות...', 'red lighten-1');
        } finally {
          this.sendLoader = false;
        }
      } else {
        this.openSnackBar('פרטי השמירות לא נכונים...', 'red lighten-1');
      }
    },
    minutesDifference(
      startHour: number,
      startMinute: number,
      endHour: number,
      endMinute: number
    ): number {
      return (endHour - startHour) * 60 + (endMinute - startMinute);
    },
    getNewTimeWithDifference(difference: number, guarding: Activity): void {
      const minutesToAdd = difference % 60;
      const hoursToAdd = (difference - minutesToAdd) / 60;

      this.addTime(guarding, hoursToAdd, minutesToAdd);
    },
    addTime(guarding: Activity, hoursToAdd: number, minutesToAdd: number): void {
      guarding.time.startMinute += minutesToAdd;
      const extraStartHours = Math.floor(guarding.time.startMinute / 60);
      guarding.time.startMinute %= 60;

      guarding.time.endMinute += minutesToAdd;
      const extraEndHours = Math.floor(guarding.time.endMinute / 60);
      guarding.time.endMinute %= 60;

      guarding.time.startHour += hoursToAdd + extraStartHours;
      guarding.time.startHour %= 24;

      guarding.time.endHour += hoursToAdd + extraEndHours;
      guarding.time.endHour %= 24;
    },
    isGuardingsValid(): boolean {
      const isValid = (guarding: Activity) =>
        guarding.groupMemberId && checkIfTimeValid(guarding);
      return this.testGuardings.guardings.every(isValid);
    },
    isTestGuardingsValid(): boolean {
      return this.isGuardingsValid() && this.validTestDetails;
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
  },
});
</script>
<style scoped>
.roundedCard {
  border-radius: 15px;
}
.GuardingTitle {
  font-size: 2rem;
  margin-bottom: -0.5rem;
}
</style>
