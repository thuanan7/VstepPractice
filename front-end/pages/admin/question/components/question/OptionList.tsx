import { useState } from 'react'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  TextField,
} from '@mui/material'
import { IOption } from '@/features/exam/type'

interface OptionListProps {
  questionId: number
  options: IOption[]
  onUpdateOption: (id: number, updatedOption: IOption) => void
  onRemoveOption: (questionId: number, id: number) => void
}

const OptionList = (props: OptionListProps) => {
  const { options, questionId, onUpdateOption, onRemoveOption } = props
  const [editedOptions, setEditedOptions] = useState<{
    [key: number]: IOption
  }>({})
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)

  const handleOptionChange = (
    id: number,
    field: 'content' | 'isCorrect',
    value: string | boolean,
  ) => {
    setEditedOptions((prev) => ({
      ...prev,
      [id]: {
        ...options.find((option) => option.id === id)!,
        [field]: value,
      },
    }))
  }

  const handleUpdate = (id: number) => {
    const updatedOption = editedOptions[id]
    if (updatedOption) {
      onUpdateOption(id, updatedOption) // Gọi hàm cập nhật
      setEditedOptions((prev) => {
        const updated = { ...prev }
        delete updated[id] // Xóa trạng thái chỉnh sửa sau khi cập nhật
        return updated
      })
    }
  }

  const handleOpenDialog = (id: number) => {
    setSelectedOptionId(id)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setSelectedOptionId(null)
    setOpenDialog(false)
  }

  const handleConfirmRemove = () => {
    if (selectedOptionId !== null) {
      onRemoveOption(questionId, selectedOptionId)
    }
    handleCloseDialog()
  }
  return (
    <>
      <List>
        {options.map((option) => {
          const isEdited =
            editedOptions[option.id]?.content !== option.content ||
            editedOptions[option.id]?.isCorrect !== option.isCorrect

          return (
            <ListItem key={option.id} sx={{ alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      editedOptions[option.id]?.isCorrect ?? option.isCorrect
                    }
                    onChange={(e) =>
                      handleOptionChange(
                        option.id,
                        'isCorrect',
                        e.target.checked,
                      )
                    }
                  />
                }
                label=""
              />

              {/* TextField: Chỉnh sửa nội dung option */}
              <TextField
                label="Trả lời"
                value={editedOptions[option.id]?.content ?? option.content}
                onChange={(e) =>
                  handleOptionChange(option.id, 'content', e.target.value)
                }
                fullWidth
              />

              {/* Nút Cập nhật: Chỉ hiển thị nếu có chỉnh sửa */}
              {/*{isEdited && (*/}
              {/*  <Button*/}
              {/*    sx={{ ml: 1 }}*/}
              {/*    variant="contained"*/}
              {/*    color="primary"*/}
              {/*    onClick={() => handleUpdate(option.id)}*/}
              {/*  >*/}
              {/*    Cập nhật*/}
              {/*  </Button>*/}
              {/*)}*/}

              <Button
                sx={{ ml: 1 }}
                variant="outlined"
                color="error"
                onClick={() => handleOpenDialog(option.id)}
              >
                Xóa
              </Button>
            </ListItem>
          )
        })}
      </List>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Xác nhận</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Bạn có chắc chắn muốn xóa option này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleConfirmRemove}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default OptionList
