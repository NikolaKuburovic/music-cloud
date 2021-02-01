import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider, Query } from "react-apollo";
import ApolloClient, { gql } from "apollo-boost";

import Root from "./Root";
import Autentikacija from "./components/Autentikacija";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql/",
  fetchOptions: { credentials: "include" },
  request: (operation) => {
    const token = localStorage.getItem("authToken") || "";
    operation.setContext({
      headers: { Authorization: `JWT ${token}` },
    });
  },
  clientState: {
    defaults: { isLoggedIn: !!localStorage.getItem("authToken") },
  },
});

const PROVERA_PRIJAVE_PRETRAGA = gql`
  query {
    isLoggedIn @client
  }
`;

ReactDOM.render(
  <ApolloProvider client={client}>
    <Query query={PROVERA_PRIJAVE_PRETRAGA}>
      {({ data }) => (data.isLoggedIn ? <Root /> : <Autentikacija />)}
    </Query>
  </ApolloProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
