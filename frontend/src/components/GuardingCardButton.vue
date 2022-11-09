<template>
  <v-col class="d-flex justify-end" sm="1" md="1">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar
          v-bind="attrs"
          v-on="on"
          color="primary"
          size="20"
          class="deleteAvatar"
          :style="[hover ? { opacity: '1' } : { opacity: '0' }]"
          @click="$emit('icon-action')"
        >
          <v-icon size="12">{{ icon }}</v-icon>
        </v-avatar>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
  </v-col>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  name: 'GuardingCardButton',
  props: {
    icon: {} as PropType<string>,
    tooltip: {} as PropType<string>,
    hover: {} as PropType<Boolean>,
  },
});
</script>

<style></style>
