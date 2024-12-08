import { useEffect, useState } from 'react'
import { examRequest, sectionPartRequest } from '@/app/api'
import SectionPartsTable from './components/SectionPartsTable'
import { SectionPart } from './components/SectionPartsTable'
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import { Editor } from '@tinymce/tinymce-react' // WYSIWYG Editor
import { SectionType, Section, ISessionPart } from '@/features/exam/type'
import { useNavigate } from 'react-router-dom'
import { ISectionPartParams } from '@/features/exam/examClient'

const sectionTypes = [
  { label: 'Listening', value: SectionType.Listening },
  { label: 'Reading', value: SectionType.Reading },
  { label: 'Writing', value: SectionType.Writing },
  { label: 'Speaking', value: SectionType.Speaking },
]
interface SectionPartsManagementForm extends ISectionPartParams {
  id?: number
}
const SectionPartsManagement = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [sectionParts, setSectionParts] = useState<ISessionPart[]>([])
  const [exams, setExams] = useState([])
  const [formData, setFormData] = useState<SectionPartsManagementForm>({
    id: undefined,
    title: '',
    instructions: '',
    orderNum: 1,
    type: SectionType.Reading,
  })
  const [editingPart, setEditingPart] = useState<SectionPart | null>(null)

  const fetchSectionParts = async () => {
    const response = await sectionPartRequest.sectionPartsById(2)
    if (response) {
      setSectionParts(response)
    } else {
    }
    console.log('dsasdas', response)
    // setSectionParts(response.data)
  }

  const fetchExams = async () => {
    const response = await examRequest.exams()
    // setExams(response.data)
  }

  useEffect(() => {
    fetchSectionParts()
    fetchExams()
  }, [])
  //
  // const handleFormSubmit = async () => {
  //   if (editingPart) {
  //     await examRequest.updateSectionPart(editingPart.id, formData)
  //   } else {
  //     await examRequest.createSectionPart(formData)
  //   }
  //   setFormData({
  //     id: null,
  //     title: '',
  //     instructions: '',
  //     orderNum: 1,
  //     type: null,
  //     examId: null,
  //     parentId: null,
  //   })
  //   setEditingPart(null)
  //   fetchSectionParts()
  // }
  //
  // const handleEdit = (part: SectionPart) => {
  //   setEditingPart(part)
  //   setFormData({
  //     id: part.id,
  //     title: part.title,
  //     instructions: part.instructions,
  //     orderNum: part.orderNum,
  //     type: part.type,
  //     examId: part.examId,
  //     parentId: part.parentId,
  //   })
  // }
  //
  // const handleDropdownChange = (field: any) => (event: any) => {
  //   setFormData({ ...formData, [field]: event.target.value })
  // }
  //
  // const handleDelete = async (id: number) => {
  //   await examRequest.deleteSectionPart(id)
  //   fetchSectionParts()
  // }
  //
  // const handleManageParts = (parentId: number) => {
  //   navigate(`/parts/${parentId}`)
  // }
  // const parentSectionOptions = sectionParts.filter(
  //   (part: Section) => part.parent === null || part.parent?.id === null,
  // )

  return (
    <div>
      <h1>Section Management</h1>
      {/*{formData.id && (*/}
      {/*  <TextField*/}
      {/*    label="ID"*/}
      {/*    value={formData.id}*/}
      {/*    InputProps={{ readOnly: true }}*/}
      {/*    style={{ marginBottom: '1rem' }}*/}
      {/*  />*/}
      {/*)}*/}
      {/*<TextField*/}
      {/*  label="Order Number"*/}
      {/*  type="number"*/}
      {/*  value={formData.orderNum}*/}
      {/*  onChange={(e) =>*/}
      {/*    setFormData({ ...formData, orderNum: parseInt(e.target.value) })*/}
      {/*  }*/}
      {/*  style={{ marginBottom: '1rem' }}*/}
      {/*/>*/}
      {/*<FormControl fullWidth style={{ marginBottom: '1rem' }}>*/}
      {/*  <InputLabel>Exam</InputLabel>*/}
      {/*  <Select*/}
      {/*    value={formData.examId}*/}
      {/*    onChange={handleDropdownChange('examId')}*/}
      {/*  >*/}
      {/*    {exams.map((exam: { id: number; Title: string }) => (*/}
      {/*      <MenuItem key={exam.id} value={exam.id}>*/}
      {/*        {exam.Title}*/}
      {/*      </MenuItem>*/}
      {/*    ))}*/}
      {/*  </Select>*/}
      {/*</FormControl>*/}
      {/*<FormControl fullWidth style={{ marginBottom: '1rem' }}>*/}
      {/*  <InputLabel>Section Type</InputLabel>*/}
      {/*  <Select value={formData.type} onChange={handleDropdownChange('type')}>*/}
      {/*    {sectionTypes.map((sectionType) => (*/}
      {/*      <MenuItem key={sectionType.value} value={sectionType.value}>*/}
      {/*        {sectionType.label}*/}
      {/*      </MenuItem>*/}
      {/*    ))}*/}
      {/*  </Select>*/}
      {/*</FormControl>*/}
      {/*<FormControl fullWidth style={{ marginBottom: '1rem' }}>*/}
      {/*  <InputLabel>Parent Section</InputLabel>*/}
      {/*  <Select*/}
      {/*    value={formData.parentId || ''}*/}
      {/*    onChange={handleDropdownChange('parentId')}*/}
      {/*  >*/}
      {/*    <MenuItem value="">None</MenuItem>*/}
      {/*    {parentSectionOptions.map((part: SectionPart) => (*/}
      {/*      <MenuItem key={part.id} value={part.id}>*/}
      {/*        {`${part.title} (${SectionType[part.type] || 'Unknown'} - Exam: ${part.examId})`}*/}
      {/*      </MenuItem>*/}
      {/*    ))}*/}
      {/*  </Select>*/}
      {/*</FormControl>*/}
      {/*<div style={{ marginBottom: '1rem' }}>*/}
      {/*  <label>Title</label>*/}
      {/*  <Editor*/}
      {/*    apiKey="your-tinymce-api-key" // Replace with your TinyMCE API Key*/}
      {/*    value={formData.title ?? ''}*/}
      {/*    onEditorChange={(content) =>*/}
      {/*      setFormData({ ...formData, title: content })*/}
      {/*    }*/}
      {/*    init={{*/}
      {/*      height: 200,*/}
      {/*      menubar: false,*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<div style={{ marginBottom: '1rem' }}>*/}
      {/*  <label>Instructions</label>*/}
      {/*  <Editor*/}
      {/*    apiKey="your-tinymce-api-key"*/}
      {/*    value={formData.instructions ?? ''}*/}
      {/*    onEditorChange={(content) =>*/}
      {/*      setFormData({ ...formData, instructions: content })*/}
      {/*    }*/}
      {/*    init={{*/}
      {/*      height: 200,*/}
      {/*      menubar: false,*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</div>*/}
      {/*<Button onClick={handleFormSubmit}>*/}
      {/*  {editingPart ? 'Update Section Part' : 'Create Section Part'}*/}
      {/*</Button>*/}
      {/*<SectionPartsTable*/}
      {/*  sectionParts={sectionParts}*/}
      {/*  onEdit={handleEdit}*/}
      {/*  onDelete={handleDelete}*/}
      {/*  onManageParts={handleManageParts}*/}
      {/*/>*/}
    </div>
  )
}

export default SectionPartsManagement
