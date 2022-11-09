import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../plugins/axios';
import { FullMember } from '../Data/Members';
import { Group } from '../Data/Groups';
import { Mission } from '../Data/Missions';
import { User } from '../Data/User';

const defaultGroup = {
  name: '',
  missionsStructure: [] as Mission[],
  members: [] as FullMember[],
  oceanGroupId: '',
  _id: '',
} as Group;

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    currentGroup: defaultGroup,
    user: {
      personalNumber: '',
      role: 0,
    } as User,
  },
  getters: {
    members(state): FullMember[] {
      return state.currentGroup.members;
    },
    missionsStructure(state): Mission[] {
      return state.currentGroup.missionsStructure;
    },
    currentGroupName(state) {
      return state.currentGroup.name;
    },
    user(state) {
      return state.user;
    },
  },
  mutations: {
    changeGroup(state, newGroup: Group) {
      state.currentGroup = newGroup;
    },
    addMember(state, member) {
      state.currentGroup.members.push(member);
    },
    removeMember(state, member) {
      state.currentGroup.members.splice(state.currentGroup.members.indexOf(member), 1);
    },
    removeGroup(state) {
      state.currentGroup = defaultGroup;
    },
    changeUserRole(state, newUserRole) {
      state.user.role = newUserRole;
    },
    changeUserNumber(state, personalNumber: string) {
      state.user.personalNumber = personalNumber;
    },
  },
  actions: {
    async changeGroup({ commit }, newGroupName) {
      const res = await axios.get(`name/${newGroupName}`);
      commit('changeGroup', res.data);
    },
    async addMember({ commit }, member) {
      await axios.put(`members/${this.state.currentGroup.name}/add`, {
        name: member.name,
        personalNumber: member.personalNumber,
        missions: [],
      });
      commit('addMember', member);
    },
    async removeMember({ commit }, member) {
      await axios.put(`members/${this.state.currentGroup.name}/remove`, member);
      commit('removeMember', member);
    },
    async removeGroup({ commit }) {
      await axios.put(`delete/${this.state.currentGroup._id}`);
      commit('removeGroup');
    },
    async findUserDetails({ commit }, id) {
      commit('changeUserNumber', id);
    },
    async setUserRole({ commit }, role) {
      commit('changeUserRole', role);
    },
  },
});
