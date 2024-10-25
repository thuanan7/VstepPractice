import {Outlet} from 'react-router-dom';
import {Box} from "@mui/material";

export const MainLayout = () => {
    return (
        <Outlet/>
    );
};

export const AdminLayout = () => {
    return <Box display={'flex'} flex={1} flexDirection={'row'}>
        <Box width={200}>
            dsadsa
        </Box>
        <Box flex={1} sx={{background: 'lightgreen'}}>
            <Outlet/>
        </Box>
    </Box>
}
