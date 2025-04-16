import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { isValidToken } from "./jwt";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) console.log("graphQLErrors: ", graphQLErrors);
  if (networkError) console.log("networkError: ", networkError);
});

// Placeholder URI; will be overridden
const httpLink = createHttpLink({
  uri: "http://placeholder:4000/graphql",
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  if (typeof window === "undefined") return { headers };
  const accessToken = window.localStorage.getItem("accessToken");
  return {
    headers: {
      ...headers,
      authorization: isValidToken(accessToken) ? `Bearer ${accessToken}` : "",
    },
  };
});

// Function to create Apollo Client with dynamic URI
export async function createApolloClient() {
  let backendUrl =
    process.env.NEXT_PUBLIC_GRAPHQL_URI || "http://placeholder:4000";
  try {
    const res = await fetch("/api/backend-url");
    const { backendUrl: fetchedUrl } = await res.json();
    if (fetchedUrl) backendUrl = fetchedUrl;
  } catch (err) {
    console.error("Failed to fetch backend URL:", err);
  }

  const dynamicHttpLink = createHttpLink({
    uri: `${backendUrl}/graphql`,
    credentials: "include",
  });

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, dynamicHttpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
}

// Export a promise-based client for use in components
export default createApolloClient();
