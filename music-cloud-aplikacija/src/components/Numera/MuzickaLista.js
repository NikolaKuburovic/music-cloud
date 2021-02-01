import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import IzmeniNumeru from "./IzmeniNumeru";
import { AiOutlineInfoCircle } from "react-icons/ai";
import NumeraAplauz from "./NumeraAplauz";
import ObrisiNumeru from "./ObrisiNumeru";
import MuzickiPlayer from "./MuzickiPlayer";
import {
  makeStyles,
  List,
  Card,
  CardContent,
  Divider,
  Grid,
  CardHeader,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@material-ui/core";

const InfoTipBoja = withStyles({
  tooltip: {
    color: "white",
    backgroundColor: "#009688",
    fontSize: "12px",
  },
})(Tooltip);

const useStyles = makeStyles({
  root: {
    "&:hover": {
      color: "#009688",
      backgroundColor: "transparent",
    },
  },
  link: {
    color: "#424242",
    textDecoration: "none",
    "&:hover": {
      color: "#009688",
    },
  },
});

export default function MuzickaLista({ tracks }) {
  const classes = useStyles();

  const [openId, setOpenId] = useState(null);

  const otvaranjeFnkc = (id) => {
    setOpenId(id);
  };

  const zatvaranjeFnkc = () => {
    setOpenId(null);
  };

  return (
    <div>
      <List>
        {tracks.map((track) => (
          <Card key={track.id}>
            <Grid
              container
              justify="left"
              alignItems="center"
              direction="column"
            >
              <Grid item>
                <Grid container>
                  <Grid item>
                    <CardHeader
                      avatar={
                        <NumeraAplauz
                          trackId={track.id}
                          likeCount={track.likes.length}
                        />
                      }
                      title={<strong>{track.title}</strong>}
                      subheader={
                        <Link
                          className={classes.link}
                          to={`/profile/${track.postedBy.id}`}
                        >
                          objavio: {track.postedBy.username}
                        </Link>
                      }
                      style={{ width: "280px" }}
                    />
                  </Grid>
                  <InfoTipBoja title="Opis" placement="top" arrow>
                    <IconButton
                      onClick={() => otvaranjeFnkc(track.id)}
                      className={classes.root}
                      style={{ padding: "0px 10px" }}
                    >
                      <AiOutlineInfoCircle className={classes.root} size={22} />
                    </IconButton>
                  </InfoTipBoja>
                  <IzmeniNumeru track={track} />
                  <ObrisiNumeru track={track} />
                </Grid>

                <Grid item>
                  <CardContent>
                    <Grid container justify="center" alignItems="center">
                      <Grid item>
                        <div key={track.id}>
                          <MuzickiPlayer url={track.url} />
                          <br />
                        </div>
                      </Grid>

                      <Grid container>
                        <Dialog
                          open={openId === track.id}
                          onClose={zatvaranjeFnkc}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            {track.title}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              {track.description}
                            </DialogContentText>
                          </DialogContent>
                        </Dialog>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                </Grid>
              </Grid>
            </Grid>
          </Card>
        ))}
      </List>
    </div>
  );
}
