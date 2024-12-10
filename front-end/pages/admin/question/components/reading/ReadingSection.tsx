import { Box } from '@mui/material'
import { ISessionPart } from '@/features/exam/type'
import withBasePartContent from '../../hoc/withBasePartContent'
import QuestionManager from '../question'
import ManagementWithTitle from '../ManagementWithTitle'

interface IReadingSectionProps {
  part: ISessionPart | null
}
const ReadingSection = (props: IReadingSectionProps) => {
  const { part } = props
  if (!part?.id) return <Box>Loading ...</Box>
  return (
    <Box mt={2}>
      <ManagementWithTitle title={'Câu hỏi'}>
        <QuestionManager part={part} />
      </ManagementWithTitle>
    </Box>
  )
}

export default withBasePartContent(ReadingSection, 'đoạn văn', 15)
