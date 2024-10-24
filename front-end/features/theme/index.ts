import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: '#EED2EE', // Màu tím nhạt hơn
            main: '#D8BFD8',  // Màu tím pastel chính
            dark: '#CDA0C5',  // Màu tím đậm hơn một chút
        },
        secondary: {
            light: '#F0E6FA', // Sắc thái rất nhạt của tím
            main: '#E6E6FA',  // Màu tím rất nhạt cho các yếu tố phụ
        },
        background: {
            default: '#F8F8FF', // Màu nền tím rất nhạt
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif', // Font mặc định
    },
    components: {
        // area for button
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Loại bỏ chữ in hoa mặc định
                    borderRadius: '8px',   // Bo góc nút
                },
                containedPrimary: {
                    backgroundColor: '#D8BFD8',
                    color: '#FFFFFF',            // Màu chữ trắng
                    '&:hover': {
                        backgroundColor: '#CDA0C5',  // Màu tím đậm hơn khi hover
                    },
                },
            },
        },
        //area for textinput
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',        // Bo góc cho TextField
                        backgroundColor: '#FFFFFF', // Màu nền trắng cho TextField
                        '& fieldset': {
                            borderColor: '#D8BFD8',   // Màu viền tím pastel
                        },
                        '&:hover fieldset': {
                            borderColor: '#CDA0C5',   // Màu viền tím đậm hơn khi hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#CDA0C5',   // Màu viền khi được focus
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#D8BFD8',            // Màu nhãn label là tím pastel
                        '&.Mui-focused': {
                            color: '#CDA0C5',          // Màu label khi focus
                        },
                    },
                },
            },
        },


    },
});

export default theme;
