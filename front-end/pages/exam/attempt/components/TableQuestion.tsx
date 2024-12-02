import { Box, Button, Grid } from '@mui/material'
import AttemptTimer from './AttemptTimmer'

interface TableQuestionProps {
  data: number[]
  onChoose: (pos: number) => void
  onAutoSubmit: () => void
  active: number
  currentSectionIndex: number
  totalAnswerOnPart: number
  totalQuestions: number
}

const TableQuestion = (props: TableQuestionProps) => {
  const { data, onChoose, active, currentSectionIndex, onAutoSubmit, totalAnswerOnPart, totalQuestions } = props;

  return (
    <Grid item xs={2} sx={{ overflow: 'hidden' }}>
      { currentSectionIndex === 3 || currentSectionIndex === 2 ? "" : <h3>Selected {totalAnswerOnPart}/{totalQuestions}</h3> }
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
          {data.filter(obj => obj != -1).map((item, index) => (
            <Button
              key={item}
              size={'small'}
              variant={item === active ? 'contained' : 'outlined'}
              onClick={() => onChoose(item)}
              sx={{
                textAlign: 'center',
                padding: 0,
                minWidth: 36,
                height: 36,
              }}
            >
              {index+1}
            </Button>
          ))}
        </Box>
      </Box>
    </Grid>
  )
}
export default TableQuestion
