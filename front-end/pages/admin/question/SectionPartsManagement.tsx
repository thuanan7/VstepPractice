import { SetStateAction, useEffect, useState } from "react";
import { getExams, getSectionParts, createSectionPart, updateSectionPart, deleteSectionPart } from "../api ??????";
/* // API 
const axios = require("axios");

const SECTION_PARTS_BASE_URL = "http://localhost:3001/api/section-parts";

const getSectionParts = async () => await axios.get(SECTION_PARTS_BASE_URL);
const createSectionPart = async (data) => await axios.post(SECTION_PARTS_BASE_URL, data);
const updateSectionPart = async (id, data) => await axios.put(`${SECTION_PARTS_BASE_URL}/${id}`, data);
const deleteSectionPart = async (id) => await axios.delete(`${SECTION_PARTS_BASE_URL}/${id}`);

module.exports = { getSectionParts, createSectionPart, updateSectionPart, deleteSectionPart };

*/

import SectionPartsTable from "./components/SectionPartsTable";
import { SectionPart } from "./components/SectionPartsTable";
import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react"; // WYSIWYG Editor
import { SectionType, Section } from "@/features/exam/type";
import { useNavigate } from "react-router-dom";

const sectionTypes = [
  { label: 'Listening', value: SectionType.Listening },
  { label: 'Reading', value: SectionType.Reading },
  { label: 'Writing', value: SectionType.Writing },
  { label: 'Speaking', value: SectionType.Speaking },
];

const SectionPartsManagement = () => {
  const navigate = useNavigate();
  const [sectionParts, setSectionParts] = useState([]);
  const [exams, setExams] = useState([]);
  const [formData, setFormData] = useState({
    id: null as number | null,
    title: null as string | null,
    instructions: null as string | null,
    orderNum: 1 as number,
    type: null as SectionType | null,
    examId: null as number | null,
    parentId: null as number | null,
  });
  const [editingPart, setEditingPart] = useState<SectionPart | null>(null);

  const fetchSectionParts = async () => {
    const response = await getSectionParts();
    setSectionParts(response.data);
  };

  const fetchExams = async () => {
    const response = await getExams();
    setExams(response.data);
  };

  useEffect(() => {
    fetchSectionParts();
    fetchExams();
  }, []);

  const handleFormSubmit = async () => {
    if (editingPart) {
      await updateSectionPart(editingPart.id, formData);
    } else {
      await createSectionPart(formData);
    }
    setFormData({ id: null, title: "", instructions: "", orderNum: 1, type: null, examId: null, parentId: null });
    setEditingPart(null);
    fetchSectionParts();
  };

  const handleEdit = (part: SectionPart) => {
    setEditingPart(part);
    setFormData({
      id: part.id,
      title: part.title,
      instructions: part.instructions,
      orderNum: part.orderNum,
      type: part.type,
      examId: part.examId,
      parentId: part.parentId,
    });
  };

  const handleDropdownChange = (field: any) => (event: any) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleDelete = async (id: number) => {
    await deleteSectionPart(id);
    fetchSectionParts();
  };

  const handleManageParts = (parentId: number) => {
    navigate(`/parts/${parentId}`);
  };
  const parentSectionOptions = sectionParts.filter((part: Section) => part.parent === null || part.parent?.id === null);

  return (
    <div>
      <h1>Section Management</h1>
      {formData.id && (
        <TextField
          label="ID"
          value={formData.id}
          InputProps={{ readOnly: true }}
          style={{ marginBottom: "1rem" }}
        />
      )}
      <TextField
        label="Order Number"
        type="number"
        value={formData.orderNum}
        onChange={(e) => setFormData({ ...formData, orderNum: parseInt(e.target.value) })}
        style={{ marginBottom: "1rem" }}
      />
      <FormControl fullWidth style={{ marginBottom: "1rem" }}>
        <InputLabel>Exam</InputLabel>
        <Select value={formData.examId} onChange={handleDropdownChange("examId")}>
          {exams.map((exam: { id: number; Title: string }) => (
            <MenuItem key={exam.id} value={exam.id}>
              {exam.Title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth style={{ marginBottom: "1rem" }}>
        <InputLabel>Section Type</InputLabel>
        <Select value={formData.type} onChange={handleDropdownChange("type")}>
          {sectionTypes.map((sectionType) => (
            <MenuItem key={sectionType.value} value={sectionType.value}>
              {sectionType.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth style={{ marginBottom: "1rem" }}>
        <InputLabel>Parent Section</InputLabel>
        <Select value={formData.parentId || ""} onChange={handleDropdownChange("parentId")}>
          <MenuItem value="">None</MenuItem>
          {parentSectionOptions.map((part: SectionPart) => (
            <MenuItem key={part.id} value={part.id}>
              {`${part.title} (${SectionType[part.type] || "Unknown"} - Exam: ${part.examId})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div style={{ marginBottom: "1rem" }}>
        <label>Title</label>
        <Editor
          apiKey="your-tinymce-api-key" // Replace with your TinyMCE API Key
          value={formData.title ?? ""}
          onEditorChange={(content) => setFormData({ ...formData, title: content })}
          init={{
            height: 200,
            menubar: false,
          }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>Instructions</label>
        <Editor
          apiKey="your-tinymce-api-key"
          value={formData.instructions ?? ""}
          onEditorChange={(content) => setFormData({ ...formData, instructions: content })}
          init={{
            height: 200,
            menubar: false,
          }}
        />
      </div>
      <Button onClick={handleFormSubmit}>
        {editingPart ? "Update Section Part" : "Create Section Part"}
      </Button>
      <SectionPartsTable sectionParts={sectionParts} onEdit={handleEdit} onDelete={handleDelete} onManageParts={handleManageParts} />
    </div>
  );
};

export default SectionPartsManagement;
