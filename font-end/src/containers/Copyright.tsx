import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import * as React from 'react';

interface ICopyright {
  column?: boolean;
}
const Copyright = (props: ICopyright) => {
  const { column = false } = props;
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      {column && <br />}
      <Link color="inherit" href="/">
        [NMCNPM] - Crawl Event App
      </Link>
      {column ? <br /> : ' - '}
      {new Date().getFullYear()}.
    </Typography>
  );
};
export default Copyright;
