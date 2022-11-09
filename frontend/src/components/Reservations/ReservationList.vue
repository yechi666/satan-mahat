<template>
  <v-container grid-list-xl class="reservationList">
    <v-layout wrap justify-space-around>
      <v-flex :key="reservation._id" v-for="reservation in reservationList">
        <v-card elevation="24">
          <v-row class="avatarRow ma-0" justify="end">
            <v-col class="d-flex justify-end" sm="1" md="1">
              <v-tooltip top>
                <template v-slot:activator="{ attrs, on }" :reservation="reservation">
                  <v-avatar
                    v-bind="attrs"
                    v-on="on"
                    :class="{
                      editButton: !isReservationOnUpdate(reservation._id),
                      doneEditButton: isReservationOnUpdate(reservation._id),
                    }"
                    size="20"
                    @click="
                      isReservationOnUpdate(reservation._id)
                        ? sendUpdateReservation()
                        : setUpdateReservationMode(reservation)
                    "
                  >
                    <v-icon v-if="!isReservationOnUpdate(reservation._id)" size="12"
                      >mdi-pencil</v-icon
                    >
                    <v-icon v-else size="12">mdi-check</v-icon>
                  </v-avatar>
                </template>
                <span>{{
                  isReservationOnUpdate(reservation._id)
                    ? isFormValid
                      ? 'עדכן'
                      : 'פרטים לא תקינים'
                    : 'ערוך'
                }}</span>
              </v-tooltip>
            </v-col>

            <v-col class="d-flex justify-end" sm="1" md="1">
              <v-tooltip top>
                <template v-slot:activator="{ attrs, on }" :reservation="reservation">
                  <v-avatar
                    v-bind="attrs"
                    v-on="on"
                    color="primary"
                    size="20"
                    @click="
                      isReservationOnUpdate(reservation._id)
                        ? cancelUpdateReservationMode()
                        : deleteReservationOnClickBtn(reservation._id)
                    "
                  >
                    <v-icon size="12" v-if="!isReservationOnUpdate(reservation._id)"
                      >mdi-delete</v-icon
                    >
                    <v-icon size="12" v-else>mdi-close</v-icon>
                  </v-avatar>
                </template>
                <span>{{ isReservationOnUpdate(reservation._id) ? 'ביטול' : 'מחק' }}</span>
              </v-tooltip>
            </v-col>
          </v-row>

          <v-form ref="form">
            <reservation-card-content
              :isEditable="isReservationOnUpdate(reservation._id)"
              class="pa-2"
              v-model="reservationUpdateInputModel"
              :placeholder="reservation"
              :isFormValid.sync="isFormValid"
            />
          </v-form>
        </v-card>
      </v-flex>
      <v-dialog v-model="openDeleteReservationDialog" width="220">
        <v-card>
          <v-card-title> למחוק את הסתייגות? </v-card-title>

          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="deleteReservation"> כן </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { Reservation } from '../../Data/Reservation';
import ReservationCardContent from './ReservationCardContent.vue';

export default Vue.extend({
  components: { ReservationCardContent },
  name: 'reservationList',
  props: {
    reservationList: {
      type: Array as () => Array<Reservation>,
      default: () => [],
    },
  },
  data() {
    return {
      openDeleteReservationDialog: false,
      currentDeleteReservationId: '',
      currentUpdateReservation: {},
      isFormValid: true,
    };
  },
  computed: {
    ...mapState(['user', 'currentGroup']),
    reservationUpdateInputModel: {
      get(): Reservation {
        return this.reservationList.find(
          ({ _id }: Reservation) => _id === (this.currentUpdateReservation as Reservation)._id
        ) as Reservation;
      },
      set(newReservation: Reservation) {
        this.currentUpdateReservation = newReservation;
      },
    },
  },
  methods: {
    isReservationOnUpdate(reservationId: string): boolean {
      return (this.currentUpdateReservation as Reservation)._id === reservationId;
    },
    setUpdateReservationMode(reservation: Reservation): void {
      this.currentUpdateReservation = reservation;
    },
    sendUpdateReservation(): void {
      this.$emit('update-reservation', this.currentUpdateReservation);
      this.cancelUpdateReservationMode();
    },
    cancelUpdateReservationMode(): void {
      this.currentUpdateReservation = {};
      this.isFormValid = false;
    },
    deleteReservation() {
      this.openDeleteReservationDialog = false;
      this.$emit('delete-reservation', this.currentDeleteReservationId);
    },
    deleteReservationOnClickBtn(reservationId: string): void {
      this.openDeleteReservationDialog = true;
      this.currentDeleteReservationId = reservationId;
    },
  },
});
</script>

<style scoped>
.reservationList {
  max-height: 50vh;
  overflow-y: auto;
}
.editButton {
  background-color: #616161;
}
.doneEditButton {
  background-color: #388e3c;
}
</style>
