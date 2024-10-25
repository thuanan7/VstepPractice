import React, {useEffect, useState} from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import {examRequest} from "@/app/api";
import {IExam} from "@/features/exam/type.ts";

const ExamManagement: React.FC = () => {
    const [exams, setExams] = useState<IExam[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editExam, setEditExam] = useState<IExam | null>(null);
    const [newExam, setNewExam] = useState({title: '', date: '', duration: 0});
    useEffect(() => {
        void handleGetExams();
    }, [])
    const handleGetExams = async () => {
        const data = await examRequest.exams();
        if(data){
            setExams(data);
        }
    }
    // Xử lý mở/đóng dialog
    const handleOpenDialog = (exam?: IExam) => {
        if (exam) setEditExam(exam);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setEditExam(null);
        setOpenDialog(false);
        setNewExam({title: '', date: '', duration: 0});
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        if (editExam) {
            setEditExam({...editExam, [name]: name === 'duration' ? +value : value});
        } else {
            setNewExam({...newExam, [name]: name === 'duration' ? +value : value});
        }
    };
    const handleSaveExam = () => {
        if (editExam) {
            setExams(exams.map(exam => (exam.id === editExam.id ? editExam : exam)));
        } else {
            // const newId = exams.length ? exams[exams.length - 1].id + 1 : 1;
            // setExams([...exams, {...newExam, id: newId}]);
        }
        handleCloseDialog();
    };
    const handleDeleteExam = (id: number) => {
        setExams(exams.filter(exam => exam.id !== id));
    };

    return (
        <Box sx={{p: 3}}>
            <Button variant="contained" color="primary" startIcon={<AddIcon/>} onClick={() => handleOpenDialog()}>
                Add New Exam
            </Button>

            <TableContainer sx={{mt: 3}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exams.map((exam) => (
                            <TableRow key={exam.id}>
                                <TableCell>{exam.title}</TableCell>
                                <TableCell>{exam.createdAt}</TableCell>
                                <TableCell>{exam.description}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => handleOpenDialog(exam)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDeleteExam(exam.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog tạo/sửa exam */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editExam ? 'Edit Exam' : 'Add New Exam'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        name="title"
                        value={editExam ? editExam.title : newExam.title}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        name="date"
                        value={editExam ? editExam.createdAt : newExam.date}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Duration (minutes)"
                        type="number"
                        name="duration"
                        value={editExam ? editExam.description : newExam.duration}
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
    );
};

export default ExamManagement;
