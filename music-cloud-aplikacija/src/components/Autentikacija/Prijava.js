import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import Error from "../Numera/Error";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
  Container,
  CircularProgress,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  podloga: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // IE 11
    marginTop: theme.spacing(1),
  },
  prijavi: {
    color: "lightcyan",
  },
}));

export default function Prijava({ setNewUser }) {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const prijavaKor = async (e, tokenAuth, client) => {
    e.preventDefault();
    const res = await tokenAuth();
    localStorage.setItem("authToken", res.data.tokenAuth.token);
    client.writeData({ data: { isLoggedIn: true } });
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <div className={classes.podloga}>
        <Avatar size={24} style={{ backgroundColor: "#05a7ef" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Prijavite se
        </Typography>

        <Mutation
          mutation={PRIJAVA_MUTACIJA}
          variables={{ username, password }}
        >
          {(tokenAuth, { loading, error, called, client }) => {
            return (
              <form
                className={classes.form}
                noValidate
                onSubmit={(e) => prijavaKor(e, tokenAuth, client)}
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Korisničko ime"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Lozinka"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={loading || !username.trim() || !password.trim()}
                >
                  {loading ? (
                    <CircularProgress color="secondary" size={24} />
                  ) : (
                    "Prijava"
                  )}
                </Button>
                <Grid container justifyContent="center">
                  <Grid item>
                    <Link
                      href="#"
                      variant="body2"
                      onClick={() => setNewUser(true)}
                    >
                      Još uvek nemate svoj nalog? Registrujte se
                    </Link>
                  </Grid>
                </Grid>

                {/* Upravljanje greškama */}

                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
      </div>
      {/* <Box mt={8}>
        <Copyright />
      </Box> */}
    </Container>
  );
}

const PRIJAVA_MUTACIJA = gql`
  mutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;
