import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import format from "date-fns/format";
import { deepOrange } from "@material-ui/core/colors";
import PortraitIcon from "@material-ui/icons/Portrait";
import Error from "../components/Numera/Error";
import Loading from "../components/Numera/Loading";
import MuzickiPlayer from "../components/Numera/MuzickiPlayer";
import { FaMusic, FaCheckCircle } from "react-icons/fa";
import {
  makeStyles,
  Card,
  CardHeader,
  Typography,
  Divider,
  CardContent,
} from "@material-ui/core";

const useStyles = makeStyles({
  podloga: {
    display: "flex",
    justifyContent: "center",
  },
  podlogaCentar: {
    display: "flex",
    justifyContent: "center",
  },
});

export default function Nalog({ match }) {
  const classes = useStyles();

  const id = match.params.id;
  return (
    <Query query={PRETRAGA_NALOGA} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <Error error={error} />;

        return (
          <div>
            <Card className={classes.podloga}>
              <CardHeader
                avatar={
                  <PortraitIcon
                    style={{ color: deepOrange[500], fontSize: "32px" }}
                  />
                }
                title={<strong>{data.user.username}</strong>}
                subheader={`MusicCloud član od ${format(
                  data.user.dateJoined,
                  "DD.MM.YYYY"
                )}`}
              />
            </Card>

            <Card className={classes.podlogaCentar}>
              <CardContent>
                <div>
                  <Typography variant="title">
                    <FaMusic
                      size={24}
                      style={{ color: "#03A9F4", marginRight: "10px" }}
                    />
                    <strong>MOJA MUZIKA</strong>
                  </Typography>
                  {data.user.trackSet.map((track) => (
                    <div key={track.id}>
                      <br />
                      <Typography>
                        <strong>{track.title}</strong> - {track.likes.length}{" "}
                        glasa
                      </Typography>
                      <MuzickiPlayer url={track.url} />
                      <br />
                      <Divider />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={classes.podlogaCentar}>
              <CardContent>
                <Typography variant="title">
                  <FaCheckCircle
                    size={24}
                    style={{ color: deepOrange[500], marginRight: "10px" }}
                  />
                  <strong>SVIDJA MI SE</strong>
                </Typography>
                {data.user.likeSet.map(({ track }) => (
                  <div key={track.id}>
                    <br />
                    <Typography>
                      <strong>{track.title}</strong> - {track.likes.length}{" "}
                      glasa
                    </Typography>
                    <Typography>objavio: {track.postedBy.username}</Typography>
                    <MuzickiPlayer url={track.url} />
                    <br />
                    <Divider />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );
      }}
    </Query>
  );
}

const PRETRAGA_NALOGA = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      username
      dateJoined
      likeSet {
        id
        track {
          id
          title
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
      trackSet {
        id
        title
        url
        likes {
          id
        }
      }
    }
  }
`;
