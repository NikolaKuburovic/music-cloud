import React, { useState, useRef } from "react";
import { ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";
import { makeStyles, Paper, IconButton, InputBase } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import { deepOrange } from "@material-ui/core/colors";

const useStyles = makeStyles({
  root: {
    padding: "4px 4px",
    display: "flex",
  },
});

export default function Pretraga({ setRezultatPretrage }) {
  const classes = useStyles();

  const [search, setSearch] = useState("");
  const inputElement = useRef();

  const brisanjePretrage = () => {
    setRezultatPretrage([]);
    setSearch("");
    inputElement.current.focus();
  };

  const upravljanjePretragom = async (e, client) => {
    e.preventDefault();
    const res = await client.query({
      query: PRETRAGA_NUMERA,
      variables: { search },
    });
    setRezultatPretrage(res.data.tracks);
  };

  const ObrisiPretragu = () => {
    return (
      <IconButton onClick={brisanjePretrage}>
        <ClearIcon style={{ color: deepOrange[500] }} />
      </IconButton>
    );
  };

  return (
    <ApolloConsumer>
      {(client) => (
        <form onSubmit={(e) => upravljanjePretragom(e, client)}>
          <Paper variant="outlined" className={classes.root} elevation={0}>
            <InputBase
              className={classes.input}
              placeholder="Pronađi muziku koja te zanima"
              inputProps={{
                classes: { underline: classes.underline },
              }}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              inputRef={inputElement}
              style={{ width: "100%" }}
            />
            <IconButton type="submit" aria-label="search">
              {search === "" ? <SearchIcon /> : <ObrisiPretragu />}
            </IconButton>
          </Paper>
        </form>
      )}
    </ApolloConsumer>
  );
}

const PRETRAGA_NUMERA = gql`
  query($search: String) {
    tracks(search: $search) {
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
