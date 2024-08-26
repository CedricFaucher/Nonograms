import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";


export default function UpsertModal(props) {
  const {
    confirmFnc,
    isUpdate,
    name = "",
    solution = ""
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setIsOpen(true)}>
        {isUpdate ? "Update" : "Create"}
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: e => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const formJson = Object.fromEntries(formData.entries());

            const name = formJson.name;
            const solution = formJson.solution;

            confirmFnc(name, solution);
            handleClose();
          }
        }}
      >
        <DialogTitle>{isUpdate ? "Update" : "Create"} Nonograms</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The nonogram solution should follow this format:
          </DialogContentText>
          <DialogContentText>
            Width (9 binary), height (9 binary), content (width x height characters)
          </DialogContentText>
          <DialogContentText>
            Example: 0000000100000000101010
          </DialogContentText>
          <DialogContentText>
            This would result in a puzzle of width 2, height 2 and having the first column full.
          </DialogContentText>
          <TextField
            autoFocus
            required
            id="name"
            name="name"
            label="Name"
            fullWidth
            margin="normal"
            variant="standard"
            defaultValue={name}
          />
          <TextField
            required
            id="solution"
            name="solution"
            label="Solution"
            fullWidth
            margin="normal"
            variant="standard"
            defaultValue={solution}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">
            {isUpdate ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}