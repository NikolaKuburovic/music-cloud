import React from "react";
import { makeStyles, LinearProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Loading() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress color="secondary" />
    </div>
  );
}
