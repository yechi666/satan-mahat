<template>
  <div class="container">
    <v-row>
      <v-col cols="7" class="offset-1">
        <v-img
          src="https://i.ibb.co/qxSsh55/Whats-App-Image-2021-06-03-at-19-59-17-removebg-preview.png"
        />
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title>
            <span class="headline">הוספת הסתייגות</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <reservation-card-content
                :isFormValid.sync="isFormValid"
                v-model="inputReservation"
              />
            </v-form>
            <v-card-actions>
              <v-btn color="red" text :disabled="!isFormValid" @click="addReservation">
                הוסף
              </v-btn>
            </v-card-actions>
            <v-divider />
            <v-card-title>
              <span class="headline">הסתייגויות שלי</span>
            </v-card-title>
            <reservation-list
              v-if="reservations.length"
              :reservationList="reservations"
              @update-reservation="updateReservation"
              @delete-reservation="deleteReservation"
            />
            <v-subheader v-else> אין לך עוד הסתייגויות </v-subheader>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <snackbar :snackbar="snackbar" :msg="snackbarObj.msg" :color="snackbarObj.color" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { Reservation } from '../Data/Reservation';
import axios from '../plugins/axios';
import ReservationCardContent from '../components/Reservations/ReservationCardContent.vue';
import ReservationList from '../components/Reservations/ReservationList.vue';
import Snackbar from '../components/Snackbar.vue';

export default Vue.extend({
  name: 'Personal',
  components: { ReservationCardContent, Snackbar, ReservationList },
  data() {
    return {
      isFormValid: false,
      inputReservation: {} as Reservation,
      reservations: [] as Reservation[],
      snackbar: false,
      snackbarObj: {
        msg: '',
        color: '',
      },
    };
  },
  computed: {
    ...mapState(['user', 'currentGroup']),
  },
  async mounted() {
    try {
      const { data }: { data: Reservation[] } = await axios.get(
        `members/${this.currentGroup.name}/personalNumber/${this.user.personalNumber}/reservations`
      );

      this.reservations = data;

      (this.$refs.form as Vue & { validate: () => boolean }).validate();

      this.openSnackBar('הסתייגויות נטענו בהצלחה!', 'green lighten-1');
    } catch (e) {
      this.openSnackBar('שגיאה בטעינת הסתייגות...', 'red lighten-1');
    }
  },
  methods: {
    closeSnackbar(): void {
      this.snackbarObj.msg = '';
      this.snackbarObj.color = '';
      this.snackbar = false;
    },
    openSnackBar(msg: string, color: string): void {
      this.snackbarObj.msg = msg;
      this.snackbarObj.color = color;
      this.snackbar = true;
    },
    async updateReservation(newReservation: Reservation) {
      try {
        await axios.put(
          `members/${this.currentGroup.name}/personalNumber/${this.user.personalNumber}/reservations`,
          {
            ...newReservation,
          }
        );

        const updatedReservationIndex = this.reservations.findIndex(
          ({ _id }: Reservation) => _id === newReservation._id
        );

        this.$set(this.reservations, updatedReservationIndex, newReservation);

        this.openSnackBar('הסתייגות עודכנה', 'green lighten-1');
      } catch (e) {
        this.openSnackBar('שגיאה בעדכון הסתייגות...', 'red lighten-1');
      }
    },
    async addReservation() {
      try {
        const { data }: { data: Reservation[] } = await axios.post(
          `members/${this.currentGroup.name}/personalNumber/${this.user.personalNumber}/reservations`,
          {
            ...this.inputReservation,
          }
        );

        this.reservations = data;

        (this.$refs.form as HTMLFormElement).reset();
        this.openSnackBar('נוסף הסתייגות בהצלחה!', 'green lighten-1');
      } catch (e) {
        this.openSnackBar('שגיאה בהוספת הסתייגות...', 'red lighten-1');
      }
    },
    async deleteReservation(reservationId: string) {
      try {
        await axios.delete(
          `members/${this.currentGroup.name}/personalNumber/${this.user.personalNumber}/reservations`,
          {
            data: { id: reservationId },
          }
        );

        this.reservations = this.reservations.filter(
          (reservation) => reservation._id !== reservationId
        );

        this.openSnackBar('הסתייגות נמחקה', 'green lighten-1');
      } catch (e) {
        this.openSnackBar('שגיאה במחיקת הסתייגות...', 'red lighten-1');
      }
    },
  },
});
</script>

<style>
html {
  overflow: hidden !important;
}
</style>
