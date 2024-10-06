import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
interface ITypeSchemaProps {
  value?: string;
  onChange: (type: string) => void;
}
const TypeSchema = (props: ITypeSchemaProps) => {
  const { value = 'text', onChange } = props;
  const handleChange = (e: any) => {
    onChange(e.target.value);
  };
  return (
    <Select labelId="demo-simple-select-label" value={value} label="Age" onChange={handleChange}>
      <MenuItem value={'text'}>Text</MenuItem>
      <MenuItem value={'href'}>Href</MenuItem>
      <MenuItem value={'html'}>Html</MenuItem>
    </Select>
  );
};

export default TypeSchema;
