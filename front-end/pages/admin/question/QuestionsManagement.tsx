import React, { useEffect, useState } from "react";
import { getQuestions, createQuestion, updateQuestion, deleteQuestion, getOptions, createOption, updateOption, deleteOption } from "../api????";

/*
// Questions
const getQuestions = async (sectionId) => await axios.get(`/api/section-parts/${sectionId}/questions`);
const createQuestion = async (data) => await axios.post(`/api/section-parts/questions`, data);
const updateQuestion = async (id, data) => await axios.put(`/api/section-parts/questions/${id}`, data);
const deleteQuestion = async (id) => await axios.delete(`/api/section-parts/questions/${id}`);

// QuestionOptions
const getOptions = async (questionId) => await axios.get(`/api/section-parts/questions/${questionId}/options`);
const createOption = async (data) => await axios.post(`/api/section-parts/questions/options`, data);
const updateOption = async (id, data) => await axios.put(`/api/section-parts/questions/options/${id}`, data);
const deleteOption = async (id) => await axios.delete(`/api/section-parts/questions/options/${id}`);

export { getQuestions, createQuestion, updateQuestion, deleteQuestion, getOptions, createOption, updateOption, deleteOption };

*/
import { Editor } from "@tinymce/tinymce-react";
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, FormControl } from "@mui/material";
import { Question, QuestionOption } from "@/features/exam/type";

const QuestionsManagement = ({ sectionId }: { sectionId: number }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    questionText: "",
    point: 0,
    orderNum: 1,
  });

  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [optionData, setOptionData] = useState({
    content: "",
    isCorrect: false,
    orderNum: 1,
    questionId: 0 as number, // Update the type to string | null
  });

  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingOption, setEditingOption] = useState<QuestionOption | null>(null);;

  // Fetch questions for the given section
  const fetchQuestions = async () => {
    const response = await getQuestions(sectionId);
    setQuestions(response.data);
  };

  // Fetch options for a selected question
  const fetchOptions = async (questionId: number) => {
    const response = await getOptions(questionId);
    setOptions(response.data);
  };

  useEffect(() => {
    fetchQuestions();
  }, [sectionId]);

  // Submit Question Form
  const handleQuestionSubmit = async () => {
    if (editingQuestion) {
      await updateQuestion(editingQuestion.id, formData);
    } else {
      await createQuestion({ ...formData, sectionId });
    }
    setFormData({ questionText: "", point: 0, orderNum: 1 });
    setEditingQuestion(null);
    fetchQuestions();
  };

  // Submit Option Form
  const handleOptionSubmit = async () => {
    if (editingOption) {
      await updateOption(editingOption.id, optionData);
    } else {
      await createOption({ ...optionData, questionId: selectedQuestion?.id });
    }
    setOptionData({ content: "", isCorrect: false, orderNum: 1, questionId: selectedQuestion?.id ?? 0 });
    setEditingOption(null);
    fetchOptions(selectedQuestion?.id ?? 0);
  };

  return (
    <div>
      <h1>Manage Questions</h1>
      {/* Questions Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Question Text</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.id}</TableCell>
              <TableCell>{question.questionText}</TableCell>
              <TableCell>{question.point}</TableCell>
              <TableCell>{question.orderNum}</TableCell>
              <TableCell>
                <Button onClick={() => {
                  setEditingQuestion(question);
                  setFormData(question);
                  setSelectedQuestion(question);
                  fetchOptions(question.id);
                }}>
                  Edit
                </Button>
                <Button color="error" onClick={() => deleteQuestion(question.id).then(fetchQuestions)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Question Form */}
      <div style={{ marginTop: "1rem" }}>
        <h2>{editingQuestion ? "Edit Question" : "Add Question"}</h2>
        <div>
          <label>Question Text</label>
          <Editor
            apiKey="your-tinymce-api-key"
            value={formData.questionText}
            onEditorChange={(content) => setFormData({ ...formData, questionText: content })}
            init={{ height: 200 }}
          />
        </div>
        <TextField
          label="Points"
          type="number"
          value={formData.point}
          onChange={(e) => setFormData({ ...formData, point: parseInt(e.target.value, 10) })}
          style={{ marginBottom: "1rem" }}
        />
        <TextField
          label="Order Number"
          type="number"
          value={formData.orderNum}
          onChange={(e) => setFormData({ ...formData, orderNum: parseInt(e.target.value, 10) })}
          style={{ marginBottom: "1rem" }}
        />
        <Button onClick={handleQuestionSubmit}>{editingQuestion ? "Update Question" : "Create Question"}</Button>
      </div>

      {/* Question Options Section */}
      {selectedQuestion && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Manage Options for Question ID {selectedQuestion.id}</h2>
          {/* Options Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Is Correct</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {options.map((option) => (
                <TableRow key={option.id}>
                  <TableCell>{option.id}</TableCell>
                  <TableCell>{option.content}</TableCell>
                  <TableCell>{option.isCorrect ? "Yes" : "No"}</TableCell>
                  <TableCell>{option.orderNum}</TableCell>
                  <TableCell>
                    <Button onClick={() => {
                      setEditingOption(option);
                      setOptionData({ ...option, questionId: selectedQuestion?.id, orderNum: parseInt(option.orderNum, 10) });
                    }}>
                      Edit
                    </Button>
                    <Button color="error" onClick={() => deleteOption(option.id).then(() => fetchOptions(selectedQuestion.id))}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Option Form */}
          <div style={{ marginTop: "1rem" }}>
            <h3>{editingOption ? "Edit Option" : "Add Option"}</h3>
            <TextField
              label="Content"
              value={optionData.content}
              onChange={(e) => setOptionData({ ...optionData, content: e.target.value })}
              style={{ marginBottom: "1rem" }}
            />
            <FormControl style={{ marginBottom: "1rem" }}>
              <label>
                <input
                  type="checkbox"
                  checked={optionData.isCorrect}
                  onChange={(e) => setOptionData({ ...optionData, isCorrect: e.target.checked })}
                />
                Is Correct
              </label>
            </FormControl>
            <TextField
              label="Order Number"
              type="number"
              value={optionData.orderNum}
              onChange={(e) => setOptionData({ ...optionData, orderNum: parseInt(e.target.value, 10) })}
              style={{ marginBottom: "1rem" }}
            />
            <Button onClick={handleOptionSubmit}>{editingOption ? "Update Option" : "Create Option"}</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsManagement;
