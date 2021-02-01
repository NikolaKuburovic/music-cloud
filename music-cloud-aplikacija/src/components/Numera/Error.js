import React, { useState } from "react";
import { Snackbar, SnackbarContent } from "@material-ui/core";

export default function Error({ error }) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <SnackbarContent
        style={{
          backgroundColor: "#009688",
        }}
        message={error.message ? "Molimo Vas da unesete ispravne podatke!" : ""}
      />
    </Snackbar>
  );
}
