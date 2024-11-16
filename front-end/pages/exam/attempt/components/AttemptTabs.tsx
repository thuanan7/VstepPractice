import { Button, Grid, Typography } from '@mui/material'
interface AttemptTabsProps {
  tabs: string[]
  active: number
  onChoose: (index: number) => void
}
const AttemptTabs = (props: AttemptTabsProps) => {
  const { tabs, active, onChoose } = props
  return (
    <Grid item xs={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Sections
      </Typography>
      {tabs.map((section, index) => (
        <Button
          key={`section_${index}`}
          fullWidth
          variant={active === index ? 'contained' : 'outlined'}
          onClick={() => onChoose(index)}
          sx={{ mb: 1 }}
        >
          {section}
        </Button>
      ))}
    </Grid>
  )
}
export default AttemptTabs
