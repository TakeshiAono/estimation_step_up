import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material"
import { useEffect, useState } from "react";

const Modal = ({onSuccess, isOpen, onCloseModal, children}) => {

  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

return (
  <>
    <Dialog
      fullWidth={fullWidth}
      maxWidth={false}
      open={open}
      onClose={onCloseModal}
    >
      <DialogTitle>チケット新規作成</DialogTitle>
      <DialogContent>
        <DialogContentText>
          作成するチケットの情報を入力してください
        </DialogContentText>
        {children}
      </DialogContent>
      <div style={{display:"flex", justifyContent: "end"}}>
        <DialogActions>
          <Button variant="contained" color="error" onClick={onCloseModal}>キャンセル</Button>
        </DialogActions>
        <DialogActions>
          <Button
            variant="contained" 
            autoFocus
            onClick={() => {
              onSuccess()
              onCloseModal()
          }}>
            作成
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  </>
  )
}

export default Modal