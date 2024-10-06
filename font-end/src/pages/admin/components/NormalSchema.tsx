import Box from '@mui/material/Box';
import { IReqSchema } from '@/features/website-crawl/types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TitleSchema } from '@/features/website-crawl/configs';
import React, { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { TransitionProps } from '@mui/material/transitions';
import { Slide } from '@mui/material';
import ItemSchema from '@/pages/admin/components/ItemSchema';
import Divider from '@mui/material/Divider';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface INormalSchemaProps {
  value: IReqSchema[];
  onSetSchemas: (schemas: IReqSchema[]) => void;
}

const NormalSchema = (props: INormalSchemaProps) => {
  const { value, onSetSchemas } = props;
  const [tempSchemas, setTempSchemas] = useState<IReqSchema[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleSaveSchema = () => {
    onSetSchemas(tempSchemas);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const titleSchema = (key: number) => {
    if (key in TitleSchema) return TitleSchema[key];
    return '';
  };
  const renderSchema = () => {
    return (
      <Box>
        <Box display={'flex'}>
          <Box width={'15%'}>
            <b>Label</b>
          </Box>
          <Box width={'45%'}>
            <b>Value</b>
          </Box>
          <Box width={'10%'}>
            <b>Type</b>
          </Box>

          <Box width={'30%'}>
            <b>Position</b>
          </Box>
        </Box>
        <Divider />
        {value.map((x, index) => {
          return (
            <Box key={`schema_${index}`} display={'flex'}>
              <Box width={'15%'}> {titleSchema(x.key)}</Box>
              <Box width={'45%'}> {x.value}</Box>
              <Box width={'10%'}> {x.type}</Box>
              <Box width={'30%'}> {x.position}</Box>
            </Box>
          );
        })}
      </Box>
    );
  };
  const handelOnChangeByKey = (key: number, type: string, value: string) => {
    setTempSchemas(pre => {
      return pre.map(x => {
        if (x.key === key) {
          if (type === 'value') x.value = value;
          if (type === 'type') x.type = value;
          if (type === 'position') x.position = parseInt(value);
        }
        return { ...x };
      });
    });
  };
  return (
    <Box position={'absolute'} sx={{ left: 0, top: 0, right: 0 }}>
      <Box display={'flex'} justifyContent={'flex-end'}>
        <Button
          onClick={() => {
            setOpen(true);
            setTempSchemas([...value]);
          }}
        >
          Edit schema
        </Button>
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Website schemas'}</DialogTitle>
        <DialogContent>
          {tempSchemas.map(schema => (
            <ItemSchema schema={schema} label={titleSchema(schema.key)} onChangeByKey={handelOnChangeByKey} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveSchema}>Save</Button>
        </DialogActions>
      </Dialog>
      {value.length === 0 ? <Typography>Dont have any schema</Typography> : renderSchema()}
    </Box>
  );
};
export default NormalSchema;
