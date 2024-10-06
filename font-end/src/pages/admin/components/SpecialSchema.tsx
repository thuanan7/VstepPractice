import Box from '@mui/material/Box';
import { TextField } from '@mui/material';

interface SpecialSchemaProps {
  onSetSpecialKey: (key: string) => void;
  value: string;
}
const SpecialSchema = (props: SpecialSchemaProps) => {
  const { onSetSpecialKey, value = '' } = props;
  return (
    <Box pt={2}>
      <TextField
        value={value}
        fullWidth={true}
        onChange={e => onSetSpecialKey(e.target.value)}
        name="special-key"
        label="Special Key *"
      />
    </Box>
  );
};
export default SpecialSchema;
