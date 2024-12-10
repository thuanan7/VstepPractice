import {
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  TextField,
} from '@mui/material'
import { Option } from './'
interface OptionListProps {
  options: Option[]
}
const OptionList = (props: OptionListProps) => {
  const { options } = props
  return (
    <List>
      {options.map((option) => (
        <ListItem key={option.id}>
          <TextField
            label="Option"
            value={option.content}
            // onChange={(e) =>
            //   handleUpdateOption(
            //     question.id,
            //     option.id,
            //     e.target.value,
            //     option.isCorrect,
            //   )
            // }
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={option.isCorrect}
                // onChange={(e) =>
                //   handleUpdateOption(
                //     question.id,
                //     option.id,
                //     option.content,
                //     e.target.checked,
                //   )
                // }
              />
            }
            label="Đúng"
          />
          <Button
            variant="outlined"
            color="error"
            // onClick={() => handleRemoveOption(question.id, option.id)}
          >
            Xóa
          </Button>
        </ListItem>
      ))}
    </List>
  )
}
export default OptionList
