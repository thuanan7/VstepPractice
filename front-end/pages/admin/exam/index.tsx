import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { examRequest } from '@/app/api'
import { IExam } from '@/features/exam/type'
import { Quiz } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { toast } from 'react-hot-toast'

const ExamManagement: React.FC = () => {
  const [exams, setExams] = useState<IExam[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editExam, setEditExam] = useState<IExam | null>(null)
  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
  })
  const navigate = useNavigate()
  useEffect(() => {
    void handleGetExams()
  }, [])
  const handleGetExams = async () => {
    const data = await examRequest.exams()
    if (data) {
      setExams(data)
    }
  }
  const handleOpenDialog = (exam?: IExam) => {
    if (exam) setEditExam(exam)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setEditExam(null)
    setOpenDialog(false)
    setNewExam({ title: '', date: '', duration: 0 })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (editExam) {
      setEditExam({ ...editExam, [name]: name === 'duration' ? +value : value })
    } else {
      setNewExam({ ...newExam, [name]: name === 'duration' ? +value : value })
    }
  }
  const handleSaveExam = () => {
    if (editExam) {
      setExams(exams.map((exam) => (exam.id === editExam.id ? editExam : exam)))
    } else {
      // const newId = exams.length ? exams[exams.length - 1].id + 1 : 1;
      // setExams([...exams, {...newExam, id: newId}]);
    }
    handleCloseDialog()
  }
  const handleDeleteExam = (id: number) => {
    setExams(exams.filter((exam) => exam.id !== id))
  }
  const handleManageQuestions = (id: number) => {
    navigate(`/admin/questions/${id}`)
  }

  const handleCreateNewExam = async () => {
    try {
      const rs = await examRequest.createNewExam()
      if (rs) {
        setExams((prevState) => [rs, ...prevState])
        toast.success('Tạo đề thi thành công')
      } else {
        toast.error('Tạo đề thi thất bại')
      }
    } catch (e) {}
  }
  return (
    <Box sx={{ p: 3 }}>
      <Box display={'flex'} justifyContent={'flex-end'}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => handleCreateNewExam()}
          sx={{
            border: '2px dashed',
            color: 'text.secondary',
            borderColor: 'text.secondary',
            borderRadius: '4px',
            padding: '8px',
            transition: 'background-color 0.3s',
          }}
        >
          Tạo mới đề thi
        </Button>
      </Box>

      <TableContainer sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Tên đề thi</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell align="center">Tác vụ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell>
                  <Tooltip title="Manage Questions">
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<Quiz />}
                      onClick={() => handleManageQuestions(exam.id)}
                      sx={{ mb: 1 }}
                    >
                      Câu hỏi
                    </Button>
                  </Tooltip>
                </TableCell>
                <TableCell>{exam.title}</TableCell>
                <TableCell>{exam.description}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(exam)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteExam(exam.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editExam ? 'Sửa thông tin đề thi' : 'Thêm mới đề thi'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên đề thi"
            name="title"
            value={editExam ? editExam.title : newExam.title}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            autoFocus
            margin="dense"
            label="Mô tả"
            name="description"
            value={editExam ? editExam.description : newExam.description}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveExam} color="primary">
            {editExam ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ExamManagement
