import CloseIcon from '@mui/icons-material/Close'
import { AdminLayoutProps } from './AdminLayout'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  IconButton,
  Drawer,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Avatar,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import logoUrl from '@/assets/logo.webp'
import { clearCredentials } from '@/features/auth/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/app/store'
import { resetExam } from '@/features/exam/examSlice'
import { IExam } from '@/features/exam/type.ts'
import CreateOrUpdateSection from '@/pages/admin/question/components/section-part/CreateOrUpdateSection'

const AdminLeftMenu = (props: AdminLayoutProps) => {
  const navigate = useNavigate()
  const exam = useSelector((state: RootState) => state.examAdmin.exam)

  const dispatch = useDispatch()
  const { window, width, isOpen, onDrawerToggle } = props
  const container =
    window !== undefined ? () => window().document.body : undefined
  const handleAccessToPage = (path: string) => {
    navigate(path)
  }
  const handleLogout = () => {
    dispatch(clearCredentials())
    handleAccessToPage('/users/login')
  }
  const drawer = (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px',
        }}
      >
        <Avatar
          src={logoUrl}
          alt="Logo"
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Box flex={1}>
          <Typography
            color="textPrimary"
            variant={'h6'}
            sx={{ fontWeight: 'bold' }}
          >
            TKPM I/2024
          </Typography>
        </Box>

        <IconButton onClick={onDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      {exam ? <ExamManagement exam={exam} /> : <HomeLeftMenu />}
    </Box>
  )

  return (
    <Drawer
      container={container}
      variant={isOpen ? 'persistent' : 'temporary'}
      open={isOpen}
      onClose={onDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width, boxSizing: 'border-box' },
      }}
    >
      {drawer}
      <Divider />
      <List>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" />
        </ListItemButton>
      </List>
    </Drawer>
  )
}
export default AdminLeftMenu

const HomeLeftMenu = () => {
  const navigate = useNavigate()
  const handleAccessToPage = (path: string) => {
    navigate(path)
  }
  return (
    <List>
      <ListItemButton onClick={() => handleAccessToPage('/admin')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Trang chủ" />
      </ListItemButton>

      <ListItemButton onClick={() => handleAccessToPage('/admin/exams')}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Quản lý đề thi" />
      </ListItemButton>
    </List>
  )
}

const ExamManagement = ({ exam }: { exam: IExam }) => {
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
        <ListItemIcon></ListItemIcon>

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
    </List>
  )
}
