import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
} from '@mui/material'

import { sectionPartRequest } from '@/app/api'
import { ISessionPart } from '@/features/exam/type'
import { toast } from 'react-hot-toast'
import LoadingSpinner from './LoadingSpinner'

const baseApiUrl = `${import.meta.env.VITE_BASE_URL || ''}/api`

const ListeningSection = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [part, setPart] = useState<ISessionPart | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [audioFile, setAudioFile] = useState<File | null>(null) // State để lưu file audio mới nếu người dùng tải lên
  const [openConfirmModal, setOpenConfirmModal] = useState(false) // Modal xác nhận thay đổi file
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const partId = searchParams.get('part')
  useEffect(() => {
    if (!partId) {
      navigate('/404', { replace: true })
    } else {
      void fetchPart()
    }
  }, [partId, navigate])
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setOpenConfirmModal(true)
    }
  }
  const handleConfirmUpload = async () => {
    if (!audioFile) return
    const formData = new FormData()
    formData.append('audio', audioFile)
    setIsLoading(true)
    try {
      const response = await sectionPartRequest.uploadAudio(
        `${partId}`,
        formData,
      )
      if (response) {
        toast.success('Tải lên thành công!')
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        toast.error('Lỗi khi tải lên audio')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải lên')
      console.error(error)
    } finally {
      setIsLoading(false)
      setOpenConfirmModal(false)
    }
  }
  const handleCancelUpload = () => {
    setOpenConfirmModal(false)
  }
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const fetchPart = async () => {
    setLoading(true)
    try {
      const res = await sectionPartRequest.getPartById(parseInt(partId!))
      if (res) {
        setPart(res)
      } else {
        navigate('/404', { replace: true })
      }
    } catch (error) {
      console.error(error)
      toast.error('Không thể tải thông tin part')
      navigate('/404', { replace: true })
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <Box p={2}>
      {isLoading && <LoadingSpinner />}

      {part ? (
        <>
          <Box mb={1}>
            <Typography fontWeight={'bold'} color={'text.secondary'}>
              Audio
            </Typography>
          </Box>
          <Box
            display={'flex'}
            flexDirection={'row'}
            gap={2}
            alignItems={'center'}
          >
            <audio controls>
              <source src={`${baseApiUrl}/${part.content}`} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            <div>
              <Button variant="contained" onClick={handleUploadClick}>
                Tải lên
              </Button>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </div>
          </Box>
          <Dialog open={openConfirmModal} onClose={handleCancelUpload}>
            <DialogTitle>Xác nhận thay đổi file audio</DialogTitle>
            <DialogContent>
              <p>Bạn có chắc chắn muốn thay đổi file audio?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelUpload} color="primary">
                Hủy
              </Button>
              <Button
                onClick={handleConfirmUpload}
                color="primary"
                variant="contained"
              >
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <div>Không tìm thấy thông tin phần này.</div>
      )}
    </Box>
  )
}
export default ListeningSection
