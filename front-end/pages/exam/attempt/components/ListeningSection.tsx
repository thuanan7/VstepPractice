import { Typography } from '@mui/material'
import { IAttemptPart } from '@/features/exam/type'
import withQuestion from '../hoc/withQuestion'

const baseApiUrl = `${import.meta.env.VITE_BASE_URL || ''}/api`
interface ListeningSectionProps {
  part: IAttemptPart
  answers: Record<string, string>
  onAnswer: (questionId: number, answer: number) => void
}

const ListeningSection = (props: ListeningSectionProps) => {
  const { part } = props
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Audio Question
      </Typography>
      <audio
        controls
        src={`${baseApiUrl}/${part.content}`}
        style={{ width: '100%', marginBottom: 16 }}
      />
    </>
  )
}

export default withQuestion(ListeningSection)
