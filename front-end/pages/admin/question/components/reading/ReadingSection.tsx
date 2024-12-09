import { Box } from '@mui/material'
import { ISessionPart } from '@/features/exam/type'
import withBasePartContent from '../../hoc/withBasePartContent'
import QuestionManager from '../question/QuestionManager'

interface IReadingSectionProps {
  part: ISessionPart | null
}
const ReadingSection = (props: IReadingSectionProps) => {
  return (
    <Box p={2}>
      <QuestionManager />
    </Box>
  )
}

export default withBasePartContent(ReadingSection, 'đoạn văn', 15)
