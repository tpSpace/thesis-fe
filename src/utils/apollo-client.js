import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { isValidToken } from "./jwt";
import getConfig from "next/config";

// Function to get GraphQL URI with runtime config support
const getGraphQLUri = () => {
  // First, try to get from runtime config (for client-side)
  if (typeof window !== "undefined" && window.__RUNTIME_CONFIG__) {
    const runtimeUri = window.__RUNTIME_CONFIG__.NEXT_PUBLIC_GRAPHQL_URI;
    if (runtimeUri && runtimeUri !== '__NEXT_PUBLIC_GRAPHQL_URI__') {
      console.log("Using runtime GraphQL URI:", runtimeUri);
      return runtimeUri;
    }
  }
  
  // Fallback to Next.js config
  const runtimeConfig =
    typeof window !== "undefined"
      ? getConfig()
      : {
          publicRuntimeConfig: {
            NEXT_PUBLIC_GRAPHQL_URI: process.env.NEXT_PUBLIC_GRAPHQL_URI,
          },
        };
  const { publicRuntimeConfig } = runtimeConfig;
  
  console.log("Using build-time GraphQL URI:", publicRuntimeConfig.NEXT_PUBLIC_GRAPHQL_URI);
  return publicRuntimeConfig.NEXT_PUBLIC_GRAPHQL_URI || 'http://34.150.46.153/api/graphql';
};

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("graphQLErrors: ", graphQLErrors);
  }
  if (networkError) {
    console.log("networkError: ", networkError);
  }
});

const httpLink = createHttpLink({
  uri: getGraphQLUri(),
  credentials: "include",
});
console.log("GraphQL URI:", getGraphQLUri());

const authLink = setContext((_, { headers }) => {
  if (typeof window === "undefined") return { headers }; // SSR guard
  const accessToken = window.localStorage.getItem("accessToken");
  return {
    headers: {
      ...headers,
      authorization: isValidToken(accessToken) ? `Bearer ${accessToken}` : "",
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export default client;
