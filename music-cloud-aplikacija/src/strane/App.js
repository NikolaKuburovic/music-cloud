import React, { useState } from "react";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import Loading from "../components/Numera/Loading";
import Error from "../components/Numera/Error";
import Grid from "@material-ui/core/Grid";
import MuzickaLista from "../components/Numera/MuzickaLista";
import KreirajNumeru from "../components/Numera/KreirajNumeru";
import Pretraga from "../components/Numera/Pretraga";

export default function App() {
  const [rezultatPretrage, setRezultatPretrage] = useState([]);

  return (
    <div>
      <Grid container spacing={3} style={{ marginTop: 2 }}>
        <Grid item xs>
          <KreirajNumeru />
        </Grid>
        <Grid item xs={4}>
          <Pretraga setRezultatPretrage={setRezultatPretrage} />
        </Grid>
        <Grid item xs></Grid>
      </Grid>
      <Query query={PRIKAZI_NUMERE_PRETRAGA}>
        {({ data, loading, error }) => {
          if (loading) return <Loading />;
          if (error) return <Error error={error} />;
          const tracks =
            rezultatPretrage.length > 0 ? rezultatPretrage : data.tracks;

          return <MuzickaLista tracks={tracks} />;
        }}
      </Query>
    </div>
  );
}

export const PRIKAZI_NUMERE_PRETRAGA = gql`
  query getTracksQuery {
    tracks {
      id
      title
      description
      url
      likes {
        id
      }
      postedBy {
        id
        username
      }
    }
  }
`;
