import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {AdminLayoutProps} from "./AdminLayout";
import {useLocation} from "react-router-dom";
import {useMemo} from "react";
import {routeTitle} from "@/app/routes/configs.ts";

const AdminHeader = (props: AdminLayoutProps) => {
    const {isOpen, width, onDrawerToggle} = props;
    const {pathname} = useLocation();
    const title = useMemo(
        () => {
            if (Object.prototype.hasOwnProperty.call(routeTitle, pathname)) {
                return routeTitle[pathname];
            }
            return 'TKPM-I/2024 Management';
        },
        [pathname],
    );
    return (<AppBar
        position="fixed"
        sx={{
            width: {sm: `calc(100% - ${isOpen ? width : 0}px)`},
            ml: {sm: `${isOpen ? width : 0}px`},
        }}
    >
        <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={onDrawerToggle}
                sx={{mr: 2}}
            >
                <MenuIcon/>
            </IconButton>
            <Typography variant="h6" noWrap component="div" color="textPrimary">
                {title}
            </Typography>
        </Toolbar>
    </AppBar>)
}
export default AdminHeader
