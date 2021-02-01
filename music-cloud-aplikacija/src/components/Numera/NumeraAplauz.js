import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import IconButton from "@material-ui/core/IconButton";
import { UserContext, KORISNIK_PRETRAGA } from "../../Root";
import ClapButton from "react-clap-button";

export default function NumeraAplauz({ trackId, likeCount }) {
  const trenutniKorisnik = useContext(UserContext);

  const iskljuciOcenjenuNumeru = () => {
    const userLikes = trenutniKorisnik.likeSet;
    const aplauz =
      userLikes.findIndex(({ track }) => track.id === trackId) > -1;
    return aplauz;
  };
  return (
    <Mutation
      mutation={APLAUZ_MUTACIJA}
      variables={{ trackId }}
      refetchQueries={() => [{ query: KORISNIK_PRETRAGA }]}
    >
      {(createLike) => (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            createLike();
          }}
          disabled={iskljuciOcenjenuNumeru()}
          style={{ backgroundColor: "transparent" }}
        >
          {likeCount}
          <ClapButton style={{ width: "20px", height: "50px" }} />
        </IconButton>
      )}
    </Mutation>
  );
}

const APLAUZ_MUTACIJA = gql`
  mutation($trackId: Int!) {
    createLike(trackId: $trackId) {
      track {
        id
        likes {
          id
        }
      }
    }
  }
`;
