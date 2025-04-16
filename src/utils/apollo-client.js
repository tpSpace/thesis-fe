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
const { publicRuntimeConfig } = getConfig();
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("graphQLErrors: ", graphQLErrors);
  }
  if (networkError) {
    console.log("networkError: ", networkError);
  }
});

const httpLink = createHttpLink({
  uri: publicRuntimeConfig.NEXT_PUBLIC_GRAPHQL_URI || "/api/graphql",
  credentials: "include",
});
console.log(" env ", publicRuntimeConfig.NEXT_PUBLIC_GRAPHQL_URI);

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
