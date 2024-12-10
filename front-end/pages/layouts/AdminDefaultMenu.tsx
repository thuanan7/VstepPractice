import { useNavigate } from 'react-router-dom'
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'

const AdminDefaultMenu = () => {
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
export default AdminDefaultMenu
