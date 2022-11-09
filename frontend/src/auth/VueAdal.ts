import Adal from 'vue-adal';
import Vue from 'vue';
import jwtDecode from 'jwt-decode';
import store from '../store/index';

Vue.use(Adal, {
  config: {
    tenant: process.env.VUE_APP_TENANT_ID,
    clientId: process.env.VUE_APP_CLIENT_ID,
    redirectUri: process.env.VUE_APP_REDIRECT_URL,
    cacheLocation: 'localStorage',
  },
  requireAuthOnInitialize: true,
});

const getUserData = () => {
  const token = localStorage.getItem('adal.idtoken')!;
  const { upn }: { upn: string } = jwtDecode(token);
  const id: string | undefined = upn.match(/\d/g)?.join('');

  localStorage.setItem('user', JSON.stringify(id));
  store.dispatch('findUserDetails', id);
};

getUserData();
