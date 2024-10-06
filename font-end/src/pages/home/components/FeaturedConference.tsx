import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import { Conference } from '@/features/events/types';
interface FeaturedPostProps {
  conference: Conference;
}

export default function FeaturedConference(props: FeaturedPostProps) {
  const { conference } = props;
  const deadline = (dateStr: string) => {
    if (dateStr === '') return '';
    return new Date(`${dateStr} UTC`).toString();
  };
  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" href={conference.website} target="_blank">
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {conference.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {conference.date} {`${conference.location !== '' ? '-' : ''} ${conference.location}`}
            </Typography>
            <Typography variant="subtitle1">
              <b>Website</b>: {conference.website}
            </Typography>
            <Typography variant="subtitle1">
              <b>Deadline</b> : {deadline(conference?.deadline || '')}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              <div dangerouslySetInnerHTML={{ __html: conference.description || '' }}></div>
            </Typography>
          </CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  );
}
