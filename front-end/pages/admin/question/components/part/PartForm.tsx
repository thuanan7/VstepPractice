import { useForm } from 'react-hook-form'
import { Button, DialogActions, Grid, TextField } from '@mui/material'
import { forwardRef, useEffect, useImperativeHandle } from 'react'

export type FormDataSession = {
  title: string
  instructions: string
  content: string
  orderNum: number
}
interface PartFormProps {
  onClose: () => void
  onSubmit: (data: FormDataSession) => void
  data?: FormDataSession
}
const PartForm = forwardRef((props: PartFormProps, ref: any) => {
  const { onClose, onSubmit, data } = props
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormDataSession>()
  useEffect(() => {
    if (data) {
      setValue('title', data.title)
      setValue('instructions', data.instructions)
      setValue('content', data.content)
      setValue('orderNum', data.orderNum)
    }
  }, [data, setValue])
  const onSubmitForm = (data: FormDataSession) => {
    onSubmit(data)
  }
  const triggerSubmit = async () => {
    const valid = await trigger()
    if (valid) {
      void handleSubmit(onSubmitForm)()
    }
  }

  useImperativeHandle(ref, () => ({
    triggerSubmit,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tiêu đề"
            variant="outlined"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Hướng dẫn"
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
            label="Nội dung"
            variant="outlined"
            multiline
            rows={4}
            error={!!errors.content}
            helperText={errors.content ? errors.content.message : ''}
          />
        </Grid>
      </Grid>
      {!data && (
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      )}
    </form>
  )
})

export default PartForm
