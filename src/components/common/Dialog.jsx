import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useUserContext } from "../../contexts/UserContextProvider";

export const AlertDialog = ({
  title,
  desc,
  btn1 = "Cancel",
  btn2 = "Save",
}) => {
  const { showDialog, setShowDialog } = useUserContext();

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <>
      <Dialog
        open={showDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {desc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{btn1}</Button>
          <Button onClick={handleClose} autoFocus>
            {btn2}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
