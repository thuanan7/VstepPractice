import CloseIcon from '@mui/icons-material/Close'
import { AdminLayoutProps } from './AdminLayout'
import { useNavigate } from 'react-router-dom'
import {
  IconButton,
  Drawer,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Avatar,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import QuizIcon from '@mui/icons-material/Quiz'
import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import logoUrl from '@/assets/logo.webp'
import { useDispatch } from 'react-redux'
import { clearCredentials } from '@/features/auth/authSlice'

const AdminLeftMenu = (props: AdminLayoutProps) => {
  const navigate = useNavigate()
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
      <List>
        <ListItemButton onClick={() => handleAccessToPage('/admin')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => handleAccessToPage('/admin/exams')}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lý Bài thi" />
        </ListItemButton>
        <ListItemButton onClick={() => handleAccessToPage('/admin/questions')}>
          <ListItemIcon>
            <QuizIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lý Câu hỏi" />
        </ListItemButton>
      </List>
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
        <ListItem button>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  )
}
export default AdminLeftMenu
