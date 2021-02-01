import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { makeStyles, IconButton, Tooltip } from "@material-ui/core";
import { UserContext } from "../../Root";
import { PRIKAZI_NUMERE_PRETRAGA } from "../../strane/App";
import { AiOutlineDelete } from "react-icons/ai";
import withStyles from "@material-ui/core/styles/withStyles";

const InfoTipBoja = withStyles({
  tooltip: {
    color: "white",
    backgroundColor: "#d50000",
    fontSize: "12px",
  },
})(Tooltip);

const useStyles = makeStyles({
  root: {
    "&:hover": {
      color: "#d50000",
      backgroundColor: "transparent",
    },
  },
});

export default function ObrisiMuzickuNumeru({ track }) {
  const classes = useStyles();

  const trenutniKorisnik = useContext(UserContext);
  const vlasnikMuzike = trenutniKorisnik.id === track.postedBy.id;

  const cacheUpravljanje = (cache, { data: { deleteTrack } }) => {
    const data = cache.readQuery({ query: PRIKAZI_NUMERE_PRETRAGA });
    const index = data.tracks.findIndex(
      (track) => Number(track.id) === deleteTrack.trackId
    );
    const tracks = [
      ...data.tracks.slice(0, index),
      ...data.tracks.slice(index + 1),
    ];
    cache.writeQuery({ query: PRIKAZI_NUMERE_PRETRAGA, data: { tracks } });
  };

  return (
    vlasnikMuzike && (
      <Mutation
        mutation={OBRISI_NUMERU_MUTACIJA}
        variables={{ trackId: track.id }}
        update={cacheUpravljanje}
      >
        {(deleteTrack) => (
          <InfoTipBoja title="Obriši numeru" placement="top" arrow>
            <IconButton
              onClick={deleteTrack}
              className={classes.root}
              style={{ padding: "0px 10px" }}
            >
              <AiOutlineDelete />
            </IconButton>
          </InfoTipBoja>
        )}
      </Mutation>
    )
  );
}

const OBRISI_NUMERU_MUTACIJA = gql`
  mutation($trackId: Int!) {
    deleteTrack(trackId: $trackId) {
      trackId
    }
  }
`;
