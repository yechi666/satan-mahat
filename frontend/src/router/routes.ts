import { Route, RouteConfig } from 'vue-router';
import Personal from '../views/Personal.vue';
import Calendar from '../views/Calendar.vue';
import Justice from '../views/Justice.vue';
import Missions from '../views/Missions.vue';
import Guards from '../views/Guards.vue';
import Manager from '../views/Manager.vue';
import { NavbarItem } from '../Data/NavbarItem';
import { AuthLevels } from '../auth/AuthLevel';
import store from '../store/index';

export const routes: Array<RouteConfig> = [
  {
    path: '/personal',
    name: 'personal',
    component: Personal,
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: Calendar,
  },
  {
    path: '/justice',
    name: 'justice',
    component: Justice,
  },
  {
    path: '/missions',
    name: 'missions',
    component: Missions,
  },
  {
    path: '/guards',
    name: 'guards',
    component: Guards,
  },
  {
    path: '/manager',
    name: 'manager',
    component: Manager,
  },
  {
    path: '',
    redirect: '/personal',
  },
];

export const navbarItems: NavbarItem[] = [
  {
    title: 'אזור אישי',
    icon: 'mdi-emoticon-devil',
    to: '/personal',
    minPermission: AuthLevels.Student,
  },
  {
    title: 'לוח שנה',
    icon: 'mdi-calendar-month',
    to: '/calendar',
    minPermission: AuthLevels.Student,
  },
  {
    title: 'טבלת צדק',
    icon: 'mdi-chart-bar',
    to: '/justice',
    minPermission: AuthLevels.Student,
  },
  {
    title: 'משימות',
    icon: 'mdi-book-search',
    to: '/missions',
    minPermission: AuthLevels.Student,
  },
  {
    title: 'שמירות',
    icon: 'mdi-view-dashboard',
    to: '/guards',
    minPermission: AuthLevels.Student,
  },
  {
    title: 'קבוצה',
    icon: 'mdi-account-reactivate-outline',
    to: '/manager',
    minPermission: AuthLevels.Student,
  },
];

export const isAlowed = (currRoute: Route): boolean => {
  const route = routes.find(({ name }) => name === currRoute.name)?.path;
  const permission = navbarItems.find(({ to }) => to === route)?.minPermission;

  return store.getters.user.role >= permission!;
};
