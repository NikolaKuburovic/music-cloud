import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import projectTheme from "./projectTheme";
import App from "./strane/App";
import Loading from "./components/Numera/Loading";
import Error from "./components/Numera/Error";
import Zaglavlje from "./components/Numera/Zaglavlje";
import Nalog from "./strane/Nalog";


export const UserContext = React.createContext();

const Root = () => (
  <Query query={KORISNIK_PRETRAGA} fetchPolicy="cache-and-network">
    {({ data, loading, error }) => {
      if (loading) return <Loading />;
      if (error) return <Error error={error} />;
      const trenutniKorisnik = data.me;

      return (
        <Router>
          <UserContext.Provider value={trenutniKorisnik}>
            <Zaglavlje trenutniKorisnik={trenutniKorisnik} />
            <Switch>
              <Route exact path="/" component={App} />
              <Route path="/profile/:id" component={Nalog} />
            </Switch>
          </UserContext.Provider>
        </Router>
      );
    }}
  </Query>
);

export const KORISNIK_PRETRAGA = gql`
  {
    me {
      id
      username
      email
      likeSet {
        track {
          id
        }
      }
    }
  }
`;

export default projectTheme(Root);
