import { Box, Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { sectionPartRequest } from '@/app/api'
import { toast } from 'react-hot-toast'
import { ISessionPart } from '@/features/exam/type'

const ReadingSection = () => {
  const navigate = useNavigate()
  const [part, setPart] = useState<ISessionPart | null>(null)
  const [newContent, setNewContent] = useState<string>('') // Dùng để lưu nội dung người dùng nhập
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const partId = searchParams.get('part')

  useEffect(() => {
    if (!partId) {
      navigate('/404', { replace: true })
    } else {
      void fetchPart()
    }
  }, [partId, navigate])

  const fetchPart = async () => {
    setLoading(true)
    try {
      const res = await sectionPartRequest.getPartById(parseInt(partId!))
      if (res) {
        setPart(res)
        setNewContent(res.content || '') // Đặt nội dung mặc định từ backend
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

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewContent(event.target.value)
  }

  const handleUpdateContent = async () => {
    if (!newContent.trim()) {
      toast.error('Nội dung không được để trống!')
      return
    }
    setLoading(true)
    try {
      const res = await sectionPartRequest.updatePartContent(
        partId!,
        newContent,
      )
      if (res) {
        toast.success('Cập nhật đoạn văn thành công!')
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        toast.error('Cập nhật thất bại, vui lòng thử lại!')
      }
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi cập nhật nội dung')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Box p={2}>
      <TextField
        fullWidth
        label="Nội dung"
        variant="outlined"
        multiline
        value={newContent}
        onChange={handleContentChange} // Cập nhật nội dung khi người dùng thay đổi
        rows={4}
      />
      <Box
        mt={2}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="contained"
          onClick={handleUpdateContent} // Gửi yêu cầu cập nhật
        >
          Cập nhật đoạn văn
        </Button>
      </Box>
    </Box>
  )
}

export default ReadingSection
