import * as React from 'react';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { getAllSync, postCrawlManual } from '@/features/website-crawl/websiteServices';

import { changeAutoJob } from '@/features/setting/settingServices';
import { IWebsiteCrawl } from '@/features/website-crawl/types';
import List from '@mui/material/List';
import { Alert, Button, ListItem } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import { AdminWebsiteCrawlDetail } from '@/pages';
import Typography from '@mui/material/Typography';

export default function AdminWebsiteCrawl() {
  let { websiteId } = useParams();
  const navigate = useNavigate();
  const [isAutoRunJob, setAutoRunJob] = useState(false);
  const [enableJob, setEnableJob] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<IWebsiteCrawl[]>([]);
  useEffect(() => {
    void fetchData();
  }, []);
  const handleReloadDataList = () => fetchData();
  async function fetchData() {
    setLoading(true);
    setError('');
    const rs = await getAllSync();
    if (rs.error !== '') {
      setError(rs?.error || '');
    }
    setData(rs.data);
    setAutoRunJob(rs.autoJob);
    setEnableJob(rs.enabledJob);
    setLoading(false);
  }

  const handleChooseWebsite = (id?: string) => {
    if (id) navigate(`/admin/website-crawl/${id}`);
    else navigate(`/admin/website-crawl`);
  };
  const handleCrawlManual = async (id: string) => {
    setLoading(true);
    const rs = await postCrawlManual(id);
    setLoading(false);
    rs ? toast.success('Crawl data sucessfully') : toast.error('Crawl data unsucessfully');
  };
  const handleToggleRunJob = async () => {
    setLoading(true);
    const newStatus = !isAutoRunJob;
    const data = await changeAutoJob(newStatus);
    if (data) {
      setAutoRunJob(newStatus);
      toast.success('Change auto run job sucessfully');
    } else {
      toast.error('Change auto run job unsucessfully');
    }
    setLoading(false);
  };
  return (
    <Box sx={{ height: 'calc(100vh - 130px)' }}>
      <Box
        display={'flex'}
        sx={{
          height: 'calc(100vh - 170px)',
          flexDirection: { md: 'row', sm: 'column', xs: 'column' },
        }}
      >
        <Box sx={{ flex: 1 }} pr={4}>
          {enableJob && (
            <Box alignItems={'center'} display={'flex'} justifyContent={'space-between'}>
              <Box display={'flex'} alignItems={'center'} gap={2}>
                <Typography color={isAutoRunJob ? 'green' : 'error'} fontWeight={'bold'}>
                  {isAutoRunJob ? 'Job running' : 'Job not running'}
                </Typography>
              </Box>
              <Button variant={'contained'} onClick={handleToggleRunJob} color={isAutoRunJob ? 'error' : 'success'}>
                {isAutoRunJob ? 'Stop' : 'Run'}
              </Button>
            </Box>
          )}

          <List>
            {data.map((x, index) => {
              return (
                <ListItem key={`web_${index}`} disablePadding>
                  <ListItemButton
                    selected={`${x.id}` === `${websiteId}`}
                    onClick={() => handleChooseWebsite(`${x.id}`)}
                  >
                    <ListItemText primary={x.name} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Box sx={{ flex: 1.5 }}>
          <AdminWebsiteCrawlDetail
            onReloadListWebsite={handleReloadDataList}
            id={websiteId}
            onCrawlManual={handleCrawlManual}
            loading={loading}
          />
        </Box>
      </Box>
      <Box height={50}>{error && <Alert severity="error">{error}</Alert>}</Box>
    </Box>
  );
}
