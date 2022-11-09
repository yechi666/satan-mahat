import Vue from 'vue';
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { AuthenticationContext } from 'vue-adal';

const AUTH_TOKEN = 'adal.idtoken';
const httpEndpoint = process.env.VUE_APP_OCEAN_HTTP;
const wsEndpoint = process.env.VUE_APP_OCEAN_WS;

const acquireJWT = (): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    AuthenticationContext.acquireToken(
      process.env.VUE_APP_CLIENT_ID,
      (error: string, token: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });

const httpLink = createHttpLink({
  uri: httpEndpoint,
});

const authLink = setContext((_: any, { headers }: Response) =>
  acquireJWT().then((token) => ({
    headers: {
      ...headers,
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  }))
);

const bearer = localStorage.getItem(AUTH_TOKEN);
const wsLink = new WebSocketLink({
  uri: wsEndpoint!,
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${bearer}`,
      },
    },
  },
});

const link = split(
  ({ query }: any) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link,
  connectToDevTools: true,
  cache: new InMemoryCache({ freezeResults: false }),
});

export const reAuthenticate = async () => {
  localStorage.removeItem(AUTH_TOKEN);
  try {
    const jwt = await acquireJWT();
    localStorage.setItem(AUTH_TOKEN, jwt);
    if (!localStorage.getItem('retried')) {
      localStorage.setItem('retried', 'true');
      window.location.href = '/';
    } else
      setTimeout(() => {
        localStorage.removeItem('retried');
      }, 3000);
  } catch {
    window.location.reload();
  }
};

const apolloOptions: any = {
  defaultClient: client,
  defaultOptions: {
    $query: {
      fetchPolicy: 'cache-and-network',
    },
  },
  errorHandler(error: Error) {
    if (error.message.includes('authorization')) {
      reAuthenticate();
    }
  },
};

const apolloProvider = new VueApollo(apolloOptions);

Vue.use(VueApollo);

export default apolloProvider;
