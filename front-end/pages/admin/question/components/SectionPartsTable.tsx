import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
export type SectionPart = {
  id: number;
  title: string;
  instructions: string;
  orderNum: number;
  type: number;
  examId: number | null;
  parentId: number | null;
};

type Props = {
  sectionParts: SectionPart[];
  onEdit: (sectionPart: SectionPart) => void;
  onDelete: (id: number) => void;

  onManageParts: (parentId: number) => void; // Callback for managing Parts
};

const SectionPartsTable: React.FC<Props> = ({ sectionParts, onEdit, onDelete, onManageParts }) => (

  <Table>
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Title</TableCell>
        <TableCell>Instructions</TableCell>
        <TableCell>Order Number</TableCell>
        <TableCell>Type</TableCell>
        <TableCell>Exam ID</TableCell>
        <TableCell>Parent ID</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {sectionParts.map((sectionPart) => (
        <TableRow key={sectionPart.id}>
          <TableCell>{sectionPart.id}</TableCell>
          <TableCell>{sectionPart.title}</TableCell>
          <TableCell>{sectionPart.instructions}</TableCell>
          <TableCell>{sectionPart.orderNum}</TableCell>
          <TableCell>{sectionPart.type}</TableCell>
          <TableCell>{sectionPart.examId}</TableCell>
          <TableCell>{sectionPart.parentId}</TableCell>
          <TableCell>
            <Button onClick={() => onEdit(sectionPart)}>Edit</Button>
            <Button color="error" onClick={() => onDelete(sectionPart.id)}>
              Delete
            </Button>
            <Button onClick={() => onManageParts(sectionPart.id)}>Manage Parts</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default SectionPartsTable;
