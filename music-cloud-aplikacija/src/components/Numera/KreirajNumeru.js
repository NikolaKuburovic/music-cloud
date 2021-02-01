import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { PRIKAZI_NUMERE_PRETRAGA } from "../../strane/App";
import Error from "./Error";
import { AiFillFileAdd } from "react-icons/ai";
import { deepOrange } from "@material-ui/core/colors";
import {
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  TextField,
  CircularProgress,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  textField: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  snimi: {
    color: deepOrange[500],
  },
  input: {
    display: "none",
  },
  audioButton: {
    "&:hover": {
      color: deepOrange[500],
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function KreirajNumeru() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [fileError, setFileError] = useState("");

  const proveraVelicine = (e) => {
    const odabraniFajl = e.target.files[0];
    const maxVelicinaFajla = 12000000;
    if (odabraniFajl && odabraniFajl.size > maxVelicinaFajla) {
      setFileError(`${odabraniFajl.name}: Fajl je preveliki`);
    } else {
      setFile(odabraniFajl);
      setFileError("");
    }
  };

  const dodajMuziku = async () => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("resource_type", "raw");
      data.append("upload_preset", "musicbox");
      data.append("cloud_name", "newcloudbox");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/newcloudbox/raw/upload",
        data
      );

      return res.data.url;
    } catch (error) {
      console.error("Greška prilikom postavljanja muzike!", error);
      setSubmitting(false);
    }
  };

  const cacheUpravljanje = (cache, { data: { createTrack } }) => {
    const data = cache.readQuery({ query: PRIKAZI_NUMERE_PRETRAGA });
    const tracks = data.tracks.concat(createTrack.track);
    cache.writeQuery({ query: PRIKAZI_NUMERE_PRETRAGA, data: { tracks } });
  };

  const postaviMuziku = async (e, createTrack) => {
    e.preventDefault();
    setSubmitting(true);
    const uploadedUrl = await dodajMuziku();
    createTrack({ variables: { title, description, url: uploadedUrl } });
  };

  const otvaranjeFnkc = () => {
    setOpen(true);
  };

  const zatvaranjeFnkc = () => {
    setOpen(false);
  };

  return (
    <>
      <Mutation
        mutation={KREIRAJ_NUMERU_MUTACIJA}
        onCompleted={(data) => {
          console.log({ data });
          setOpen(false);
          setTitle("");
          setDescription("");
          setFile("");
          setSubmitting(false);
        }}
        update={cacheUpravljanje}
      >
        {(createTrack, { error }) => {
          if (error) return <Error error={error} />;

          return (
            <div>
              <Button
                variant="outlined"
                color="primary"
                onClick={otvaranjeFnkc}
                style={{ marginLeft: "30px" }}
              >
                Dodaj muziku
              </Button>
              <Dialog
                fullScreen
                open={open}
                onClose={zatvaranjeFnkc}
                TransitionComponent={Transition}
              >
                <form onSubmit={(e) => postaviMuziku(e, createTrack)}>
                  <AppBar className={classes.appBar}>
                    <Toolbar>
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={zatvaranjeFnkc}
                        aria-label="close"
                      >
                        <CloseIcon
                          disabled={submitting}
                          onClick={() => {
                            setOpen(false);
                            setFileError("");
                            setFile("");
                            setTitle("");
                            setDescription("");
                          }}
                          variant="outlined"
                          type="button"
                          style={{
                            color: deepOrange[500],
                            marginRight: "15px",
                          }}
                        />
                      </IconButton>
                      <Typography variant="h6" className={classes.title}>
                        Dodaj svoju muzičku numeru
                      </Typography>
                      <Button
                        autoFocus
                        style={{ color: "lightcyan" }}
                        disabled={
                          submitting ||
                          !title.trim() ||
                          !description.trim() ||
                          !file
                        }
                        variant="outlined"
                        type="submit"
                      >
                        {submitting ? (
                          <CircularProgress
                            className={classes.snimi}
                            size={24}
                          />
                        ) : (
                          "snimi"
                        )}
                      </Button>
                    </Toolbar>
                  </AppBar>

                  <DialogTitle>Podeli svoju muziku sa svetom</DialogTitle>
                  <DialogContent>
                    <DialogContentText style={{ marginBottom: 30 }}>
                      Unesi naslov muzičke numere, njen opis i dodaj audio fajl
                      / Fajl treba da bude manji od 12MB
                    </DialogContentText>
                    <FormControl fullWidth>
                      <TextField
                        label="Naslov"
                        placeholder="Koji je naslov tvoje muzičke numere..."
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className={classes.textField}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <TextField
                        multiline
                        rows="5"
                        label="Opis muzike"
                        placeholder="Kako bi opisao svoju muziku..."
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className={classes.textField}
                      />
                    </FormControl>
                    <FormControl error={Boolean(fileError)}>
                      <input
                        id="audio"
                        required
                        type="file"
                        accept="audio/mp3, audio/wav"
                        className={classes.input}
                        onChange={proveraVelicine}
                      />
                      <label htmlFor="audio">
                        <Button
                          color={file ? "secondary" : "primary"}
                          component="span"
                          style={{ backgroundColor: "transparent" }}
                          className={classes.audioButton}
                        >
                          <AiFillFileAdd
                            color="secondary"
                            className={classes.audioButton}
                            style={{ marginRight: "5px" }}
                            size={36}
                          />
                          Muzički fajl
                        </Button>
                        {file && file.name}

                        <FormHelperText>{fileError}</FormHelperText>
                      </label>
                    </FormControl>
                  </DialogContent>
                </form>
              </Dialog>
            </div>
          );
        }}
      </Mutation>
    </>
  );
}

const KREIRAJ_NUMERU_MUTACIJA = gql`
  mutation($title: String!, $description: String!, $url: String) {
    createTrack(title: $title, description: $description, url: $url) {
      track {
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
  }
`;
