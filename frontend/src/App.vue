<template>
  <v-app>
    <Navbar v-if="user.role > this.studentRole"></Navbar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import Navbar from './components/Navbar.vue';
import { getUserRoleByPersonalNumber } from './queries/user';
import { AuthLevels, STUDENT_ROLE } from './auth/AuthLevel';
import { Group } from './Data/Groups';

export default Vue.extend({
  name: 'App',
  components: {
    Navbar,
  },
  data() {
    return {
      studentRole: AuthLevels.Student,
    };
  },
  computed: {
    ...mapState(['user']),
    scrollbarTheme(): string {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
  },
  async created() {
    try {
      const userRole = await this.$apollo.query({
        query: getUserRoleByPersonalNumber,
        variables: {
          soldier_id: this.user.personalNumber,
        },
      });
      userRole.data.core_users_roles[0].role_id === STUDENT_ROLE
        ? this.setUserRole(AuthLevels.Student)
        : this.findUserRole();
    } catch {
      this.setUserRole(AuthLevels.Student);
    }
  },
  methods: {
    ...mapActions(['setUserRole']),
    async findUserRole() {
      const groups: Group[] = (await axios.get(`/admin/${this.user.personalNumber}/names`))
        .data;

      groups.length > 0
        ? groups.find((group) => group.name === 'All')
          ? this.setUserRole(AuthLevels.Admin)
          : this.setUserRole(AuthLevels.GroupAdmin)
        : this.setUserRole(AuthLevels.Instructor);
    },
  },
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Heebo&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Assistant&display=swap');
* {
  font-family: 'Assistant' !important;
}

.v-application {
  font-family: 'Assistant' !important;
}

#bar {
  background-color: #70321b;
}

::-webkit-scrollbar {
  width: 8px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: #878c92;
}
</style>
