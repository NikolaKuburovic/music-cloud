import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineMenu } from "react-icons/ai";
import Odjava from "../Autentikacija/Odjava";

import {
  Drawer,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";

const useStyles = makeStyles({
  meniLista: {
    width: 250,
  },
  celaLista: {
    width: "auto",
  },
  icon: {
    paddingLeft: 20,
  },
});

export default function Navigacija() {
  const classes = useStyles();

  const [state, setState] = useState({ right: false });

  const Pocetna = () => {
    return (
      <Link
        to="/"
        style={{
          textDecoration: "none",
          fontSize: 14,
          fontWeight: "bold",
          color: "black",
        }}
      >
        POČETNA
      </Link>
    );
  };

  const desniDrawerMeni = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.meniLista, {
        [classes.celaLista]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={desniDrawerMeni(anchor, false)}
      onKeyDown={desniDrawerMeni(anchor, false)}
    >
      <List>
        {[<Pocetna />].map((text) => (
          <ListItem button key={text}>
            <ListItemIcon className={classes.icon}>
              <AiFillHome size={25} />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {[<Odjava />].map((text) => (
          <ListItem button key={text}>
            <ListItemIcon className={classes.icon}>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            style={{ color: "white" }}
            onClick={desniDrawerMeni(anchor, true)}
          >
            <AiOutlineMenu size={22} style={{ color: "lightcyan" }} />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={desniDrawerMeni(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
