import React, { useState, useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import axios from "axios";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { UserContext } from "../../Root";
import Error from "./Error";
import { AiOutlineEdit, AiFillFileAdd } from "react-icons/ai";
import { deepOrange } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import {
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  FormControl,
  FormHelperText,
  DialogTitle,
  CircularProgress,
  Slide,
  AppBar,
  Toolbar,
  Typography,
  Tooltip,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    "&:hover": {
      color: "#2196F3",
      backgroundColor: "transparent",
    },
  },
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

const InfoTipBoja = withStyles({
  tooltip: {
    color: "white",
    backgroundColor: "#2196F3",
    fontSize: "12px",
  },
})(Tooltip);

export default function IzmeniNumeru({ track }) {
  const classes = useStyles();

  const trenutniKorisnik = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(track.title);
  const [description, setDescription] = useState(track.description);
  const [file, setFile] = useState("");
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isCurrentUser = trenutniKorisnik.id === track.postedBy.id;

  const proveraVelicine = (e) => {
    const odabraniMuzickiFile = e.target.files[0];
    const granicaVelicine = 12000000;
    if (odabraniMuzickiFile && odabraniMuzickiFile.size > granicaVelicine) {
      setFileError(`${odabraniMuzickiFile.name}: Fajl je preveliki`);
    } else {
      setFile(odabraniMuzickiFile);
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

  const postaviMuziku = async (e, updateTrack) => {
    e.preventDefault();
    setSubmitting(true);
    const uploadedUrl = await dodajMuziku();
    updateTrack({
      variables: { trackId: track.id, title, description, url: uploadedUrl },
    });
  };

  const otvaranjeFnkc = () => {
    setOpen(true);
  };

  const zatvaranjeFnkc = () => {
    setOpen(false);
  };

  return (
    isCurrentUser && (
      <>
        <InfoTipBoja title="Izmeni numeru" placement="top" arrow>
          <IconButton
            onClick={otvaranjeFnkc}
            className={classes.root}
            style={{ padding: "0px 10px" }}
          >
            <AiOutlineEdit className={classes.root} />
          </IconButton>
        </InfoTipBoja>

        <Mutation
          mutation={IZMENA_NUMERE_MUTACIJA}
          onCompleted={(data) => {
            console.log({ data });
            setOpen(false);
            setTitle("");
            setDescription("");
            setFile("");
            setSubmitting(false);
          }}
        >
          {(updateTrack, { error }) => {
            if (error) return <Error error={error} />;

            return (
              <div>
                <Dialog
                  fullScreen
                  open={open}
                  onClose={zatvaranjeFnkc}
                  TransitionComponent={Transition}
                >
                  <form onSubmit={(e) => postaviMuziku(e, updateTrack)}>
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
                          Izmeni podatke za muzičku numeru
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
                        Unesi novi naslov muzičke numere, promeni opis ili
                        izmeni audio fajl / Fajl treba da bude manji od 12MB
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
    )
  );
}

const IZMENA_NUMERE_MUTACIJA = gql`
  mutation($trackId: Int!, $title: String, $url: String, $description: String) {
    updateTrack(
      trackId: $trackId
      title: $title
      url: $url
      description: $description
    ) {
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
