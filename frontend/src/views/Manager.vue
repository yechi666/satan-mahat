<template>
  <div class="home">
    <v-card>
      <v-row>
        <v-col cols="10" offset-md="1">
          <v-card
            img="https://www.lifewire.com/thmb/y18VtfUIcOHstbxIL0t1s0OjSLg=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-159108946-58dd49885f9b584683da2bd2.jpg"
          >
            <v-card-title>בחרו קבוצה</v-card-title>
            <v-divider></v-divider>
            <v-list-item-group color="primary" v-model="chosenGroupName">
              <v-list-item
                @click="changeGroup(groupName)"
                v-for="(groupName, key) in groupsNames"
                :key="key"
                :label="groupName"
                :value="groupName"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="groupName"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action @click="editDialog = true">
                  <v-btn icon color="transperant">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action @click="removeDialog = true">
                  <v-btn icon color="transperant">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-card>
          <v-col cols="12" class="d-flex justify-center mb-6">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="transparent" v-bind="attrs" v-on="on">
                  <v-icon @click="newGroupDialog = true" color="white">mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>הוספת קבוצה חדשה</span>
            </v-tooltip>
          </v-col>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="removeDialog" max-width="19rem">
      <v-card>
        <v-card-title>
          למחוק את הקבוצה:
          <br />
          "{{ currentGroupName }}"?
        </v-card-title>
        <v-card-actions>
          <v-btn class="mr-6" color="red" text @click="removeDialog = false">לא</v-btn>
          <v-spacer />

          <v-btn class="ml-6" color="red" text @click="removeGroup()">כן</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="50rem">
      <EditGroup />
    </v-dialog>
    <v-dialog v-model="newGroupDialog" max-width="20rem">
      <NewGroupe @add-new-group="addGroup($event, index)" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';
import axios from '../plugins/axios';
import { AuthLevels } from '../auth/AuthLevel';
import { Group } from '../Data/Groups';
import NewGroupe from '../components/NewGroup.vue';
import EditGroup from '../components/EditGroup.vue';

export default Vue.extend({
  name: 'Manager',
  data() {
    return {
      newGroupDialog: false as boolean,
      groups: [] as Object[],
      groupsNames: [] as string[],
      editDialog: false,
      removeDialog: false,
      chosenGroupName: '',
    };
  },
  components: {
    NewGroupe,
    EditGroup,
  },
  computed: {
    ...mapGetters(['currentGroupName']),
    ...mapState(['user']),
  },
  methods: {
    changeGroup(name: string) {
      this.$store.dispatch('changeGroup', name);
    },
    async addGroup(groupName: string) {
      await axios.put(`${groupName}`);
      this.newGroupDialog = false;
      this.groupsNames.push(groupName);
    },
    removeGroup() {
      this.removeDialog = false;
      this.$store.dispatch('removeGroup');
      this.groupsNames.splice(this.groupsNames.indexOf(this.currentGroupName));
    },
  },
  async mounted() {
    this.groupsNames = (await axios.get('/names')).data.map((group: Group) => group.name);
    this.user.role === AuthLevels.Admin
      ? (this.groupsNames = (await axios.get(`/names`)).data.map((group: Group) => group.name))
      : (this.groupsNames = (
          await axios.get(`/admin/${this.user.personalNumber}/names`)
        ).data.map((group: Group) => group.name));

    this.chosenGroupName = this.currentGroupName;
  },
});
</script>
