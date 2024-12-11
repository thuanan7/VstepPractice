import { Typography } from '@mui/material'
import { IAttemptPart } from '@/features/exam/type'
import withQuestion from '../hoc/withQuestion'

interface ReadingSectionProps {
  part: IAttemptPart
  answers: Record<string, string>
  onAnswer: (questionId: number, answer: number) => void
}

const ReadingSection = (props: ReadingSectionProps) => {
  const { part } = props
  return (
    <Typography variant="body1" gutterBottom>
      {part?.content || ''}
    </Typography>
  )
}

export default withQuestion(ReadingSection)
