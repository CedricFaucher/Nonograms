import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";


export default function ResetModal(props) {
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
      <Button color="warning" variant="outlined" onClick={() => setIsOpen(true)}>
        Reset
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
      >
        <DialogTitle>Reset Nonograms</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset the nonograms {name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => {
            confirmFnc();
            handleClose();
          }}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}