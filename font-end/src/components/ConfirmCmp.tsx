import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import * as React from 'react';
interface ConfirmCmpProps {
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  content?: string;
}
const ConfirmCmp = (props: ConfirmCmpProps) => {
  const {
    onConfirm,
    title = 'Confirm delete',
    onClose,
    isOpen = false,
    content = 'Do you want to this event?',
  } = props;
  const handleConfirm = () => {
    if (isOpen) {
      onConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="draggable-dialog-title">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleConfirm}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmCmp;
