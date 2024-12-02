import React, { useEffect, useState } from "react";
import { getParts as getParts, createPart, updatePart, deletePart } from "../api???";

/* API
const getParts = async (parentId) => await axios.get(`/api/section-parts/${parentId}/children`);
const createPart = async (data) => await axios.post(`/api/section-parts/${data.parentId}/children`, data);
const updatePart = async (id, data) => await axios.put(`/api/section-parts/${id}`, data);
const deletePart = async (id) => await axios.delete(`/api/section-parts/${id}`);

export { getParts, createPart, updatePart, deletePart };
 */
import PartsTable from "./components/PartsTable";
import { TextField, Button } from "@mui/material";
import { SectionType, Section } from "@/features/exam/type";
import { Editor } from "@tinymce/tinymce-react";
import { SectionPart } from "./components/SectionPartsTable";
import { useNavigate } from "react-router-dom";

interface ManagePartsProps {
    parentId: number;
}

const PartsManagement: React.FC<ManagePartsProps> = ({ parentId }) => {
    const navigate = useNavigate();
    const [parts, setParts] = useState([]);
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

    const fetchParts = async () => {
        const response = await getParts(parentId);
        setParts(response.data);
    };

    useEffect(() => {
        fetchParts();
    }, [parentId]);

    const handleFormSubmit = async () => {
        if (editingPart) {
            await updatePart(editingPart.id, formData);
        } else {
            await createPart(formData);
        }
        setFormData({ id: null, title: "", instructions: "", orderNum: 1, type: null, examId: null, parentId: parentId });
        setEditingPart(null);
        fetchParts();
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

    const handleDelete = async (id: number) => {
        await deletePart(id);
        fetchParts();
    };
    // Handle navigation to the ManageQuestions page
    const handleManageQuestions = (sectionId: number) => {
        navigate(`/questions/${sectionId}`);
    };
    return (
        <div>
            <h2>Parts Management</h2>
            <TextField
                label="Order Number"
                type="number"
                value={formData.orderNum}
                onChange={(e) => setFormData({ ...formData, orderNum: parseInt(e.target.value) })}
                style={{ marginBottom: "1rem" }}
            />
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
                    init={{ height: 200, menubar: false }}
                />
            </div>v
            <Button onClick={handleFormSubmit}>
                {editingPart ? "Update Part" : "Create Part"}
            </Button>
            <PartsTable parts={parts} onEdit={handleEdit} onDelete={handleDelete} onManageQuestions={handleManageQuestions} />
        </div>
    );
};

export default PartsManagement;
