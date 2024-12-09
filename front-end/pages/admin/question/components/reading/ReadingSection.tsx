import { Box } from '@mui/material'
import { ISessionPart } from '@/features/exam/type'
import withBasePartContent from '../../hoc/withBasePartContent'

interface IReadingSectionProps {
  part: ISessionPart | null
}
const ReadingSection = (props: IReadingSectionProps) => {
  return <Box p={2}>asdas</Box>
}

export default withBasePartContent(ReadingSection)
