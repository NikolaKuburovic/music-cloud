import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Error from "../Numera/Error";
import { AiFillCheckCircle } from "react-icons/ai";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  CircularProgress,
} from "@material-ui/core";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  podloga: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(8),
  },
  form: {
    width: "100%", // IE 11
    marginTop: theme.spacing(3),
  },
}));

const style = {
  marginTop: "10px",
};

export default function Registracija({ setNewUser }) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const registracijaKor = (e, createUser) => {
    e.preventDefault();
    createUser();
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.podloga}>
        <Avatar size={24} style={{ backgroundColor: "#03A9F4" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registracija
        </Typography>

        <Mutation
          mutation={REGISTRACIJA_MUTACIJA}
          variables={{ username, email, password }}
          onCompleted={data => {
            console.log({ data })
            setOpen(true)
          }}
        >
          {(createUser, { loading, error }) => {
            return (
              <form
                onSubmit={(e) => registracijaKor(e, createUser)}
                className={classes.form}
                noValidate
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="uname"
                      name="username"
                      variant="outlined"
                      required
                      fullWidth
                      id="username"
                      label="Korisničko ime"
                      autoFocus
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      label="Email Adresa"
                      name="email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="Lozinka"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={
                    loading ||
                    !username.trim() ||
                    !email.trim() ||
                    !password.trim()
                  }
                  style={style}
                >
                  {loading ? (
                    <CircularProgress color="secondary" size={24} />
                  ) : (
                    "Registracija"
                  )}
                </Button>

                <Grid container justify="flex-end" justifyContent="center">
                  <Grid item>
                    <Link
                      onClick={() => setNewUser(false)}
                      href="#"
                      variant="body2"
                    >
                      Već ste se registrovali? Prijavite se
                    </Link>
                  </Grid>
                </Grid>

                {/* Upravljanje greškama */}

                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>

        {/* Potvrda registracije */}
        <Dialog
          open={open}
          disableBackdropClick={true}
          TransitionComponent={Transition}
        >
          <DialogTitle>
            <Avatar
              style={{ color: "#03A9F4", backgroundColor: "transparent" }}
            >
              <AiFillCheckCircle />
            </Avatar>
            Dobro došao
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Korisnički nalog je uspešno kreiran!
              <br />
              Sada si deo Music<strong>Cloud</strong> zajednice!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => setNewUser(false)}
              style={{ color: "white", backgroundColor: "#03A9F4" }}
            >
              Prijava
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* <Box mt={5}>
        <Copyright />
      </Box> */}
    </Container>
  );
}

const REGISTRACIJA_MUTACIJA = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user {
        username
        email
      }
    }
  }
`;
