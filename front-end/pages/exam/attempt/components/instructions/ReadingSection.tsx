import { Typography } from '@mui/material'
import { IAttemptPart } from '@/features/exam/type'

interface ReadingSectionProps {
  part: IAttemptPart
}

const ReadingSection = (props: ReadingSectionProps) => {
  const { part } = props
  return (
    <Typography variant="body1" gutterBottom>
      {part?.content ? part.content.split('\n').map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      )) : ''}
    </Typography>
  )
}

export default ReadingSection
