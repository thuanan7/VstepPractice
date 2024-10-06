import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Checkbox, FormControlLabel, TextField, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { deleteWebsite, getByIdSync, sendWebsiteData } from '@/features/website-crawl/websiteServices';
import { DefaultWebSiteReq, IReqEditWebsite, IReqSchema } from '@/features/website-crawl/types';
import ConfirmCmp from '@/components/ConfirmCmp';
import { mappingWebsiteToFrom } from '@/features/website-crawl/websiteUtils';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import SpecialSchema from '@/pages/admin/components/SpecialSchema';
import NormalSchema from '@/pages/admin/components/NormalSchema';
interface IAdminWebsiteCrawlDetail {
  id?: string;
  onCrawlManual: (id: string) => void;
  loading: boolean;
  onReloadListWebsite: () => void;
}

export default function AdminWebsiteCrawlDetail(props: IAdminWebsiteCrawlDetail) {
  const [params, setParams] = useState<IReqEditWebsite>(DefaultWebSiteReq);
  const { id = undefined, loading = false, onCrawlManual, onReloadListWebsite } = props;
  const [idDelete, setIdDelete] = useState<number | undefined>(undefined);
  const [title, setTitle] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      void getDataEdit(id);
    }
  }, [id]);

  async function getDataEdit(id: string) {
    const rs = await getByIdSync(id);
    if (rs.error === '' && rs.data) {
      setParams(mappingWebsiteToFrom(rs));
      setTitle(rs.data.name);
    }
  }
  const handleOKDelete = async () => {
    if (idDelete) {
      const rs = await deleteWebsite(idDelete);
      if (rs) {
        toast.success(`Delete website successfully`);
        navigate(`/admin/website-crawl`);
      }
    }
  };

  const handelOpenConfirmDelete = () => {
    setIdDelete(parseInt(`${id}`));
  };
  const handleSendWebsite = async () => {
    let valid = true;
    if (params.isSpecial) {
      if (params.specialKey === '' || !params.specialKey) {
        valid = false;
        toast.error('Special key not empty');
      }
    }

    if (params.name || params.name === '') {
      valid = false;
      toast.error('Name website not empty');
    }
    if (params.url || params.url === '') {
      valid = false;
      toast.error('Url website not empty');
    }
    if (valid) {
      const rs = await sendWebsiteData(params, id ? parseInt(id) : undefined);
      if (rs) {
        onReloadListWebsite();
        toast.success(`${id ? 'Update' : 'Create new'} website successfully`);
        if (id) {
          void getDataEdit(id);
        } else {
          setParams(DefaultWebSiteReq);
        }
      }
    }
  };
  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box display={'flex'}>
          {id && (
            <Button
              onClick={() => {
                navigate(`/admin/website-crawl`);
              }}
            >
              <AddIcon />
            </Button>
          )}

          <Typography variant={'h5'} color={'#556BD6'}>
            {id ? `Update website ` : 'Add new website for crawler'}
            <b>{title}</b>
          </Typography>
        </Box>

        {id && (
          <Box>
            <Button
              sx={{ mr: 2 }}
              variant="contained"
              color={'success'}
              disabled={loading}
              onClick={() => onCrawlManual(id)}
            >
              <DownloadIcon /> crawl
            </Button>
            <Button disabled={loading} color={'error'} onClick={handelOpenConfirmDelete}>
              <DeleteIcon />
            </Button>
          </Box>
        )}
      </Box>

      <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
        <Box height={'100%'} width={'100%'} py={4}>
          <Box pb={2}>
            <TextField
              fullWidth={true}
              name="name"
              label="Website name"
              value={params?.name}
              onChange={e => {
                setParams(r => {
                  return { ...r, name: e.target.value };
                });
              }}
              required
            />
          </Box>
          <Box pb={2}>
            <TextField
              fullWidth={true}
              name="url"
              label="Url website"
              value={params?.url}
              required
              onChange={e => {
                setParams(r => {
                  return { ...r, url: e.target.value };
                });
              }}
            />
          </Box>

          <Box pb={2}>
            <Tooltip title="If crawl time is 0, auto job will not be run">
              <TextField
                type={'number'}
                fullWidth={true}
                name="url"
                label="Time crawl (minute)"
                value={params?.time || 0}
                onChange={e => {
                  setParams(r => {
                    return { ...r, time: parseInt(e.target.value) };
                  });
                }}
                required
              />
            </Tooltip>
          </Box>
          <Box pb={2} position={'relative'}>
            {id ? (
              <Typography>{params.isSpecial === true ? 'Special Website' : 'Normal Website'}</Typography>
            ) : (
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={e => {
                      setParams(r => {
                        return { ...r, isSpecial: e.target.checked };
                      });
                    }}
                  />
                }
                label="Special Website"
              />
            )}
            <Box maxHeight={400}>
              {params.isSpecial ? (
                <SpecialSchema
                  value={params.specialKey || ''}
                  onSetSpecialKey={(key: string) =>
                    setParams(r => {
                      return { ...r, specialKey: key };
                    })
                  }
                />
              ) : (
                <NormalSchema
                  onSetSchemas={(schemas: IReqSchema[]) => {
                    setParams(r => {
                      return { ...r, schemas: schemas };
                    });
                  }}
                  value={params?.schemas?.sort(x => x.key) || []}
                />
              )}
            </Box>
          </Box>

          <Box gap={4} display={'flex'} mt={4} width={'100%'} justifyContent={'flex-end'}>
            {id ? (
              <>
                <Button variant="contained" disabled={loading} color={'warning'} onClick={handleSendWebsite}>
                  Send data
                </Button>
              </>
            ) : (
              <Button type={'submit'} variant="contained" disabled={loading} onClick={handleSendWebsite}>
                Send data
              </Button>
            )}
          </Box>
          <ConfirmCmp
            title={'Confirm delete website'}
            content={'Do you want to delete website?'}
            onClose={() => setIdDelete(undefined)}
            onConfirm={handleOKDelete}
            isOpen={idDelete !== undefined}
          />
        </Box>
      </Box>
    </Box>
  );
}
