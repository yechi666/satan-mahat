<template>
  <div>
    <v-navigation-drawer expand-on-hover permanent absolute app right class="nav">
      <v-list nav dense>
        <v-list-item-group v-model="group">
          <v-list-item v-for="item in permitedItems" :key="item.title" :to="item.to">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';
import { NavbarItem } from '../Data/NavbarItem';
import { navbarItems } from '../router/routes';

export default Vue.extend({
  name: 'TestDetails',
  components: {},
  data() {
    return {
      dialogm1: '',
      dialog: false,
      drawer: false,
      group: null,
    };
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['currentGroupName']),
    permitedItems(): NavbarItem[] {
      return navbarItems.filter((item) => this.user.role >= item.minPermission);
    },
  },

  methods: {
    changeGroup(name: string): void {
      this.dialog = false;
      this.$store.dispatch('changeGroup', name);
    },
  },
});
</script>

<style scoped>
.nav {
  z-index: 10;
}
</style>
