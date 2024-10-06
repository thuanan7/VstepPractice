import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useEffect, useMemo, useState } from 'react';
import { getAllEvents, deleteEvent } from '@/features/events/eventServices';
import { Conference, ConferencePagination } from '@/features/events/types';
import Link from '@mui/material/Link';
import { Pagination } from '@mui/material';
import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ConfirmCmp from '@/components/ConfirmCmp';
import { Close } from '@mui/icons-material';

const EventManagements = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Conference[]>([]);
  const [paging, setPaging] = useState<ConferencePagination | undefined>(undefined);
  const { search } = useLocation();
  const searchQuery = React.useMemo(() => new URLSearchParams(search), [search]);
  const query = new URLSearchParams(search);
  const [open, setOpen] = React.useState<number | undefined>(undefined);
  const [keywordSearch, currentPage] = useMemo(() => {
    return [query.get('keyword') || '', query.get('page') || '1'];
  }, [query]);
  const [keyWord, setKeyWord] = useState(keywordSearch);
  useEffect(() => {
    loadAllEvents();
  }, [searchQuery]);
  const handleChangeSearch = (e: any) => {
    setKeyWord(e.target.value || '');
  };
  const loadAllEvents = () => {
    getAllEvents('all', currentPage, keywordSearch).then(rs => {
      if (rs.status && typeof rs.data !== 'string') {
        setRows(rs?.data?.data || []);
        setPaging(rs?.data?.paging || undefined);
      }
    });
  };
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    navigate({
      pathname: '/admin/events',
      search: `?page=${value}${keywordSearch !== '' ? `keyword=${keywordSearch}` : ''}`,
    });
  };
  const handleOKDelete = () => {
    if (open)
      void deleteEvent(open).then(r => {
        if (r.data) {
          toast.success('Delete event sucessfully');
          loadAllEvents();
          setOpen(undefined);
        } else {
          toast.error('Delete event fail');
        }
      });
  };
  const handleConfirmDelete = (id: number) => {
    setOpen(id);
  };

  const handleKeyPress = (e: any) => {
    if (e.keyCode == 13) {
      navigate(`${location.pathname}${keyWord !== '' ? `?keyword=${keyWord}` : ''}`);
    }
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} mb={2}>
        <Box width={400} sx={{ background: 'white', display: 'flex', alignItems: 'center' }}>
          <InputBase
            onKeyDown={handleKeyPress}
            onChange={handleChangeSearch}
            value={keyWord}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search ..."
            inputProps={{ 'aria-label': 'search ...' }}
          />
          <IconButton
            type="button"
            sx={{ p: '10px' }}
            aria-label="search"
            onClick={() => {
              if (keyWord !== '') {
                setKeyWord('');
                navigate(`${location.pathname}`);
              }
            }}
          >
            {keyWord === '' ? <SearchIcon /> : <Close />}
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Deadline</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.title} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Link target="_blank" href={row.website}>
                    {row.title}
                  </Link>
                </TableCell>
                <TableCell align="left">{row.date}</TableCell>
                <TableCell align="left">{row.location !== '' ? row.location : '-'}</TableCell>
                <TableCell align="left">{row?.deadline || ''}</TableCell>
                <TableCell align="left">{row?.createdDate || ''}</TableCell>
                <TableCell align="center">
                  <Button color={'error'} onClick={() => handleConfirmDelete(row.id)}>
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box my={4} display={'flex'} justifyContent={'flex-end'}>
        <Pagination
          onChange={handleChange}
          count={paging?.page}
          defaultPage={paging?.currentPage || 0 + 1}
          showFirstButton
          showLastButton
        />
      </Box>
      <ConfirmCmp
        title={'Confirm delete event'}
        content={'Do you want to delete event?'}
        onClose={() => setOpen(undefined)}
        onConfirm={handleOKDelete}
        isOpen={open !== undefined}
      />
    </Box>
  );
};
export default EventManagements;
