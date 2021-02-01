import React from "react";
import { Link } from "react-router-dom";
import Navigacija from "./Navigacija";
import { FaMusic } from "react-icons/fa";
import {
  makeStyles,
  withStyles,
  AppBar,
  Toolbar,
  Typography,
  Badge,
} from "@material-ui/core";

const useStyles = makeStyles({
  zaglavlje: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
});

const StyledBadge = withStyles({
  badge: {
    backgroundColor: "#76FF03",
    color: "#76FF03",
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.6)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(4.0)",
      opacity: 0,
    },
  },
})(Badge);

export default function Zaglavlje({ trenutniKorisnik }) {
  const classes = useStyles();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link to="/" className={classes.zaglavlje}>
            <FaMusic
              size={22}
              style={{ color: "#03A9F4", marginRight: "5px" }}
            />
            <Typography variant="h6" color="secondary" noWrap>
              Music<strong>Cloud</strong>
            </Typography>
          </Link>

          {/* Autentikacija korisnika */}
          {trenutniKorisnik && (
            <Link
              to={`/profile/${trenutniKorisnik.id}`}
              className={classes.zaglavlje}
            >
              <Typography variant="h6" style={{ color: "white" }} noWrap>
                <strong>{trenutniKorisnik.username}</strong>
              </Typography>
              <StyledBadge
                overlap="circle"
                variant="dot"
                style={{ marginLeft: "3px", marginTop: "3px" }}
              />
            </Link>
          )}
          <Navigacija style={{ color: "white" }} />
        </Toolbar>
      </AppBar>
    </>
  );
}
