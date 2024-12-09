import React, { useRef, useState } from 'react'
import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { sectionPartRequest } from '@/app/api'
import { toast } from 'react-hot-toast'
import { ISessionPart } from '@/features/exam/type.ts'
import PartForm, {
  FormDataPart,
} from '@/pages/admin/question/components/part/PartForm.tsx'
import EditIcon from '@mui/icons-material/Edit'
interface UpdatePartProps {
  part: ISessionPart
}
const ButtonUpdatePart = (props: UpdatePartProps) => {
  const { part } = props
  const formRef = useRef<any>(null)
  const [newContent, setNewContent] = useState<string>('') // Nội dung chỉnh sửa
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false) // Quản lý modal

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleUpdateContent = async (data: FormDataPart) => {
    if (!newContent.trim()) {
      toast.error('Nội dung không được để trống!')
      return
    }
    setLoading(true)
    try {
      // const res = await sectionPartRequest.updatePartContent(
      //   part!.id,
      //   newContent,
      // )
      // if (res) {
      //   toast.success('Cập nhật đoạn văn thành công!')
      //   setOpenModal(false) // Đóng modal sau khi cập nhật thành công
      //   // Có thể gọi lại API để cập nhật lại part trong state hoặc reload page
      // } else {
      //   toast.error('Cập nhật thất bại, vui lòng thử lại!')
      // }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật nội dung')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleClickUpdate = () => {
    if (formRef.current) {
      formRef.current.triggerSubmit()
    }
  }

  return (
    <>
      <Button
        variant={'outlined'}
        color={'warning'}
        startIcon={<EditIcon />}
        onClick={handleOpenModal}
      >
        Cập nhật hướng dẫn
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        open={openModal}
        onClose={handleCloseModal}
      >
        <DialogTitle>Chỉnh sửa part</DialogTitle>
        <DialogContent>
          <PartForm
            ref={formRef}
            data={part}
            onClose={handleCloseModal}
            onSubmit={handleUpdateContent}
          />
          <Box
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
            gap={2}
            mt={2}
          >
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<EditIcon />}
              onClick={handleClickUpdate}
            >
              Cập nhật
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ButtonUpdatePart
