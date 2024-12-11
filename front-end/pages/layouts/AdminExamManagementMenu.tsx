import { IExam } from '@/features/exam/type.ts'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { resetExam } from '@/features/exam/examSlice.ts'
import {
  Avatar,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CreateOrUpdateSection from '@/pages/admin/question/components/section-part/CreateOrUpdateSection'
import AdminPathManagementMenu from './AdminPathManagementMenu'
import PreviewIcon from '@mui/icons-material/Preview'
interface AdminExamManagementMenuProps {
  exam: IExam
}
const AdminExamManagementMenu = (props: AdminExamManagementMenuProps) => {
  const { exam } = props
  const firstLetter = exam.title.charAt(0).toUpperCase()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleBackExam = () => {
    dispatch(resetExam())
    navigate('/admin/exams')
  }
  return (
    <List>
      <ListItemButton onClick={handleBackExam}>
        <ListItemIcon>
          <AssignmentIcon
            sx={{ color: (theme) => theme.palette.primary.main }}
          />
        </ListItemIcon>
        <ListItemText>
          <Typography
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Quản lý đề thi
          </Typography>
        </ListItemText>
      </ListItemButton>
      <ListItemButton sx={{ bgcolor: 'rgba(216,191,216, 0.5)' }}>
        <ListItemIcon>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 24,
              height: 24,
              display: 'flex',
              justifyContent: 'center',
              borderRadius: 0,
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white' }}>
              {firstLetter}
            </Typography>
          </Avatar>
        </ListItemIcon>
        <ListItemText>
          <Typography
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {exam.title}
          </Typography>
        </ListItemText>
      </ListItemButton>
      <Divider />
      <ListItemButton>
        <Button
          variant="contained"
          startIcon={<PreviewIcon />}
          onClick={() => navigate(`/exam/${exam.id}/attempt`)}
          sx={{
            backgroundColor: '#1976d2',
            color: 'white',
            textTransform: 'none',
            borderRadius: '12px',
            padding: '12px 16px',
            margin: '8px 0',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Preview đề thi
        </Button>
      </ListItemButton>
      <ListItemButton>
        <CreateOrUpdateSection
          examId={`${exam.id}`}
          onRefresh={(newValue: string) => {
            const currentParams = new URLSearchParams(searchParams)
            currentParams.set('section', newValue)
            navigate(
              {
                pathname: window.location.pathname,
                search: currentParams.toString(),
              },
              { replace: true },
            )
            window.location.reload()
          }}
        />
      </ListItemButton>
      <Divider />
      <AdminPathManagementMenu examId={exam.id} />
    </List>
  )
}
export default AdminExamManagementMenu
