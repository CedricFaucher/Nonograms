import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";


export default function DeleteModal(props) {
  const {
    confirmFnc,
    name
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button color="error" variant="outlined" onClick={() => setIsOpen(true)}>
        Delete
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
      >
        <DialogTitle>Delete Nonograms</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the nonograms {name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => {
            confirmFnc();
            handleClose();
          }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}