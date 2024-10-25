import {Box, Button, Divider, Drawer, IconButton, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {AdminLayoutProps} from "./AdminLayout";
import { useMemo} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
const AdminLeftMenu = (props: AdminLayoutProps) => {
    const navigate = useNavigate();
    const {window, width, isOpen, onDrawerToggle} = props
    const container = window !== undefined ? () => window().document.body : undefined;
    const handleAccessToPage = (path: string) => {
        navigate(path);
    }
    const drawer = (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', padding: '16px'}}>
                <IconButton onClick={onDrawerToggle}>
                    <CloseIcon/>
                </IconButton>
            </Box>
            <Divider/>
            <ItemMenu keyPath={'/admin'} onClick={() => handleAccessToPage('/admin')} title={'Dashboard'}/>
            <ItemMenu keyPath={'/admin/exams'} onClick={() => handleAccessToPage('/admin/exams')} title={'Bài thi'}/>
        </Box>
    );

    return <Drawer
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
            [`& .MuiDrawer-paper`]: {width, boxSizing: 'border-box'},
        }}
    >
        {drawer}
    </Drawer>
}
export default AdminLeftMenu


const ItemMenu = ({title, onClick, keyPath}: { title: string, keyPath: string, onClick: () => void }) => {
    const {pathname} = useLocation();
    const isActive = useMemo(
        () => {
            return pathname === keyPath;
        },
        [pathname, keyPath],
    );
    return <Button variant={isActive ? 'contained' : undefined} fullWidth sx={{pl: 1,borderRadius:0}} style={{textAlign: 'left'}}
                   onClick={onClick}>
        <Box width={'100%'}>
            <Typography color={isActive ? 'white' : 'textPrimary'}> {title}</Typography>
        </Box>
    </Button>
}
