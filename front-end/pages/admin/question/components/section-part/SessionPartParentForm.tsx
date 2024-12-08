import { useForm, Controller } from 'react-hook-form'
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  DialogActions,
} from '@mui/material'
import {
  SessionType,
  SectionPartTypes,
  sessionTypeOptions,
} from '@/features/exam/configs'

export type FormDataSession = {
  title: string
  instructions: string
  content: string
  orderNum: number
  sectionType: SessionType
  type: SectionPartTypes
  sessionType: number
}
const SessionPartParentForm = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (data: FormDataSession) => void
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormDataSession>()

  const onSubmitForm = (data: FormDataSession) => {
    onSubmit(data)
  }
  return (
    <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Section Type</InputLabel>
            <Controller
              name="sectionType"
              control={control}
              rules={{ required: 'Section Type is required' }}
              render={({ field }) => (
                <Select {...field} label="Type" error={!!errors.type}>
                  {sessionTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.type && (
              <p style={{ color: 'red' }}>{errors.type.message}</p>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ''}
          />
        </Grid>
        {/* Instructions Field */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Instructions"
            variant="outlined"
            multiline
            rows={4}
            {...register('instructions', {
              required: 'Instructions are required',
            })}
            error={!!errors.instructions}
            helperText={errors.instructions ? errors.instructions.message : ''}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Content"
            variant="outlined"
            multiline
            rows={4}
            {...register('content', { required: 'Content is required' })}
            error={!!errors.content}
            helperText={errors.content ? errors.content.message : ''}
          />
        </Grid>
      </Grid>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </form>
  )
}

export default SessionPartParentForm
