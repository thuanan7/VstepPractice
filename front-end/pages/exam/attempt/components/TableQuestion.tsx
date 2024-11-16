import { Box, Button, Grid } from '@mui/material'
import AttemptTimer from './AttemptTimmer'

interface TableQuestionProps {
  data: number[]
  onChoose: (pos: number) => void
  onAutoSubmit: () => void
  active: number
}
const TableQuestion = (props: TableQuestionProps) => {
  const { data, onChoose, active, onAutoSubmit } = props
  return (
    <Grid item xs={2} sx={{ overflow: 'hidden' }}>
      <AttemptTimer minutes={30} onTimeUp={onAutoSubmit} />
      <Box
        sx={{
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
          padding: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {data.map((_, index) => (
            <Button
              key={index}
              size={'small'}
              variant={index === active ? 'contained' : 'outlined'}
              onClick={() => onChoose(index)}
              sx={{
                textAlign: 'center',
                padding: 0,
                minWidth: 36,
                height: 36,
              }}
            >
              {index + 1}
            </Button>
          ))}
        </Box>
      </Box>
    </Grid>
  )
}
export default TableQuestion
