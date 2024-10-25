import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, IconButton, Paper, Tabs, Tab, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Fake data cho các kỳ thi
const exams = [
    { id: 1, name: 'VSTEP B2 - Exam 1' },
    { id: 2, name: 'VSTEP B2 - Exam 2' },
    { id: 3, name: 'VSTEP B2 - Exam 3' },
];

// Cấu trúc dữ liệu câu hỏi và câu trả lời
interface Question {
    id: number;
    type: string; // "Listening", "Reading", "Writing", "Speaking"
    content: string;
    choices?: string[]; // Chỉ cho trắc nghiệm
    correctAnswer?: string;
}

const ExamQuestionManagement: React.FC = () => {
    const [selectedExamId, setSelectedExamId] = useState<number | null>(null); // ID của kỳ thi đã chọn
    const [questions, setQuestions] = useState<Question[]>([
        { id: 1, type: 'Listening', content: 'Listen to the conversation and answer the question.', choices: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
        { id: 2, type: 'Reading', content: 'Read the passage and choose the correct answer.', choices: ['A', 'B', 'C', 'D'], correctAnswer: 'B' },
        { id: 3, type: 'Writing', content: 'Write a response to the question.' },
        { id: 4, type: 'Speaking', content: 'Discuss the following topic and record your answer.' }
    ]);
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]); // Danh sách câu hỏi đã lọc
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [editQuestion, setEditQuestion] = useState<Question | null>(null);
    const [newQuestion, setNewQuestion] = useState({ type: 'Listening', content: '', choices: [], correctAnswer: '' });

    useEffect(() => {
        // Lọc câu hỏi theo loại tab đã chọn
        const examQuestions = questions.filter(q => q.type === ['Listening', 'Reading', 'Writing', 'Speaking'][selectedTab]);
        setFilteredQuestions(examQuestions);
    }, [selectedTab, questions]);

    // Chuyển tab
    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    // Chọn kỳ thi mới từ dropdown
    const handleSelectExam = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedExamId(event.target.value as number);
    };

    // Mở dialog cho việc thêm hoặc chỉnh sửa câu hỏi
    const handleOpenDialog = (question?: Question) => {
        if (question) setEditQuestion(question);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setEditQuestion(null);
        setOpenDialog(false);
        setNewQuestion({ type: 'Listening', content: '', choices: [], correctAnswer: '' });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (editQuestion) {
            setEditQuestion({ ...editQuestion, [name]: value });
        } else {
            setNewQuestion({ ...newQuestion, [name]: value });
        }
    };

    const handleSaveQuestion = () => {
        if (editQuestion) {
            setQuestions(questions.map(q => q.id === editQuestion.id ? editQuestion : q));
        } else {
            const newId = questions.length ? questions[questions.length - 1].id + 1 : 1;
            setQuestions([...questions, { ...newQuestion, id: newId }]);
        }
        handleCloseDialog();
    };

    const handleDeleteQuestion = (id: number) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Typography variant="h4" gutterBottom>
                Exam Question Management
            </Typography>

            {/* Dropdown chọn kỳ thi */}
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="select-exam-label">Select Exam</InputLabel>
                <Select
                    labelId="select-exam-label"
                    value={selectedExamId || ''}
                    label="Select Exam"
                    onChange={handleSelectExam}
                >
                    {exams.map((exam) => (
                        <MenuItem key={exam.id} value={exam.id}>
                            {exam.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Tabs cho các phần kỹ năng */}
            <Tabs value={selectedTab} onChange={handleChangeTab} aria-label="Exam Sections">
                <Tab label="Listening" />
                <Tab label="Reading" />
                <Tab label="Writing" />
                <Tab label="Speaking" />
            </Tabs>

            {selectedExamId ? (
                <Box sx={{ mt: 3, flexGrow: 1, overflowY: 'auto', paddingRight: 1 }}>
                    {/* Danh sách câu hỏi có vùng cuộn riêng */}
                    {filteredQuestions.map((question) => (
                        <Paper key={question.id} sx={{ mb: 2, p: 2 }}>
                            <Typography variant="body1">{question.content}</Typography>
                            {question.choices && (
                                <ul>
                                    {question.choices.map((choice, index) => (
                                        <li key={index}>{choice}</li>
                                    ))}
                                </ul>
                            )}
                            <IconButton color="primary" onClick={() => handleOpenDialog(question)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteQuestion(question.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Paper>
                    ))}
                </Box>
            ) : (
                <Typography variant="h6" color="error" sx={{ mt: 3 }}>
                    Please select an exam to manage questions.
                </Typography>
            )}

            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ mt: 2 }}>
                Add New Question
            </Button>

            {/* Dialog tạo/sửa câu hỏi */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Content"
                        name="content"
                        value={editQuestion ? editQuestion.content : newQuestion.content}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                    />
                    {(selectedTab === 0 || selectedTab === 1) && (
                        <>
                            <TextField
                                margin="dense"
                                label="Choices (comma separated)"
                                name="choices"
                                value={editQuestion ? editQuestion.choices?.join(', ') : newQuestion.choices.join(', ')}
                                onChange={(e) => {
                                    const choices = e.target.value.split(',').map(choice => choice.trim());
                                    if (editQuestion) setEditQuestion({ ...editQuestion, choices });
                                    else setNewQuestion({ ...newQuestion, choices });
                                }}
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                margin="dense"
                                label="Correct Answer"
                                name="correctAnswer"
                                value={editQuestion ? editQuestion.correctAnswer : newQuestion.correctAnswer}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveQuestion} color="primary">
                        {editQuestion ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ExamQuestionManagement;
