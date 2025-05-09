import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface DeleteDisciplineDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  disciplineName: string;
}

export default function DeleteDisciplineDialog({
  open,
  onClose,
  onConfirm,
  disciplineName,
}: DeleteDisciplineDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{disciplineName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
