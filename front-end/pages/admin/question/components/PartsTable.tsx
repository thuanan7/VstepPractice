import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

import { SectionPart } from "./SectionPartsTable";

export type Props = {
  parts: SectionPart[];
  onEdit: (part: SectionPart) => void;
  onDelete: (id: number) => void;
  onManageQuestions: (sectionId: number) => void; // Callback for managing questions
};

const PartsTable: React.FC<Props> = ({ parts: parts, onEdit, onDelete, onManageQuestions }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Title</TableCell>
        <TableCell>Instructions</TableCell>
        <TableCell>Order Number</TableCell>
        <TableCell>Type</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {parts.map((part) => (
        <TableRow key={part.id}>
          <TableCell>{part.id}</TableCell>
          <TableCell>{part.title}</TableCell>
          <TableCell>{part.instructions}</TableCell>
          <TableCell>{part.orderNum}</TableCell>
          <TableCell>{part.type}</TableCell>
          <TableCell>
            <Button onClick={() => onEdit(part)}>Edit</Button>
            <Button color="error" onClick={() => onDelete(part.id)}>
              Delete
            </Button>
            <Button onClick={() => onManageQuestions(part.id)}>Manage Questions</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default PartsTable;
