import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import TypeSchema from '@/pages/admin/components/TypeSchema';
import { IReqSchema } from '@/features/website-crawl/types';
interface IItemSchemaProps {
  label: string;
  schema: IReqSchema;
  onChangeByKey: (key: number, type: string, value: string) => void;
}
const ItemSchema = (props: IItemSchemaProps) => {
  const { label, schema, onChangeByKey } = props;
  const handleChangeType = (type: string) => {
    onChangeByKey(schema.key, 'type', type);
  };
  const handleChangeValue = (_value: string) => {
    onChangeByKey(schema.key, 'value', _value);
  };

  const handleChangePosition = (_value: string) => {
    onChangeByKey(schema.key, 'position', _value);
  };
  return (
    <Box width={500} mb={2}>
      <Grid container spacing={2}>
        <Grid item xs={4} md={7}>
          <Typography color={'red'} fontWeight={'bold'}>
            {label}
          </Typography>
          <TextField fullWidth={true} value={schema?.value || ''} onChange={e => handleChangeValue(e.target.value)} />
        </Grid>
        <Grid item xs={4} md={2}>
          <Typography>Position</Typography>
          <TextField
            fullWidth={true}
            value={schema?.position || 0}
            onChange={e => handleChangePosition(e.target.value)}
          />
        </Grid>
        <Grid item xs={4} md={3}>
          <Typography>Type</Typography>
          <TypeSchema value={schema.type} onChange={handleChangeType} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default ItemSchema;
