import React, { useState, useEffect } from 'react'
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
} from '@mui/material'
import { toast } from 'react-hot-toast'
import { attemptRequest } from '@/app/api'
import { IReviewAnswer } from '@/features/exam/type.ts'

interface ReviewModalProps {
  open: boolean
  onClose: () => void
  attemptId: string | null
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onClose,
  attemptId,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [resultData, setResultData] = useState<any>(null)

  useEffect(() => {
    if (open && attemptId) {
      void fetchResult(attemptId)
    }
  }, [open, attemptId])

  const fetchResult = async (attemptId: string) => {
    setLoading(true)
    try {
      const response = await attemptRequest.getAttemptResultById(attemptId)
      if (response) {
        setResultData(response)
      }
    } catch (error) {
      toast.error('Không thể tải kết quả')
    } finally {
      setLoading(false)
    }
  }
  const renderResultCell = (answer: IReviewAnswer) => {
    if (answer.sectionType === 1 || answer.sectionType === 2) {
      // Listening & Reading
      return answer.isCorrect ? 'Đúng' : 'Sai'
    } else if (answer.sectionType === 3 && answer.writingScore) {
      // Writing
      return (
        <Grid container>
          <Grid item xs={6} textAlign={'left'}>
            <Typography variant="body2" color="textSecondary" component="span">
              {`Hoàn thành: `}
            </Typography>
            <Typography
              variant="body2"
              color="error"
              component="span"
              fontWeight="bold"
            >
              {`${answer.writingScore.taskAchievement}`}
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign={'left'}>
            <Typography variant="body2" color="textSecondary" component="span">
              {`Mạch lạc: `}
            </Typography>
            <Typography
              variant="body2"
              color="error"
              component="span"
              fontWeight="bold"
            >
              {`${answer.writingScore.coherenceCohesion}`}
            </Typography>
          </Grid>

          <Grid item xs={6} textAlign={'left'}>
            <Typography variant="body2" color="textSecondary" component="span">
              {`Từ vựng: `}
            </Typography>
            <Typography
              variant="body2"
              color="error"
              component="span"
              fontWeight="bold"
            >
              {`${answer.writingScore.lexicalResource}`}
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign={'left'}>
            <Typography variant="body2" color="textSecondary" component="span">
              {`Ngữ pháp: `}
            </Typography>
            <Typography
              variant="body2"
              color="error"
              component="span"
              fontWeight="bold"
            >
              {`${answer.writingScore.grammarAccuracy}`}
            </Typography>
          </Grid>

          <Grid item xs={12} textAlign={'right'}>
            <Typography variant="body2" color="textSecondary" component="span">
              {`Tổng điểm: `}
            </Typography>
            <Typography
              variant="body2"
              color="error"
              component="span"
              fontWeight="bold"
            >
              {`${answer.writingScore.totalScore}`}
            </Typography>
          </Grid>
        </Grid>
      )
    } else if (answer.sectionType === 4 && answer.speakingScore) {
      // Speaking
      const {
        pronunciation,
        fluency,
        accuracy,
        prosody,
        vocabulary,
        totalScore,
        audioUrl,
      } = answer.speakingScore
      return (
        <Grid container>
          <Grid item xs={6} textAlign={'left'}>
            <Typography variant="body2" color="textSecondary" component="span">
              {`Phát âm: `}
            </Typography>
            <Typography
              variant="body2"
              color="error"
              component="span"
              fontWeight="bold"
            >
              {`${pronunciation}`}
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign={'left'}>
            <Typography variant="body2" color="textSecondary" component="span">
              {`Lưu loát: `}
            </Typography>
            <Typography
              variant="body2"
              color="error"
              component="span"
              fontWeight="bold"
            >
              {`${fluency}`}
            </Typography>
          </Grid>

          <Grid item xs={6} textAlign={'left'}>
            <Typography variant="body2" color="textSecondary" component="span">
              {`Độ chính xác: `}
            </Typography>
            <Typography
              variant="body2"
              color="error"
              component="span"
              fontWeight="bold"
            >
              {`${accuracy}`}
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign={'left'}>
            <Typography variant="body2" color="textSecondary" component="span">
              {`Ngữ điệu: `}
            </Typography>
            <Typography
              variant="body2"
              color="error"
              component="span"
              fontWeight="bold"
            >
              {`${prosody}`}
            </Typography>
          </Grid>

          <Grid item xs={6} textAlign={'left'}>
            <Typography variant="body2" color="textSecondary" component="span">
              {`Từ vựng: `}
            </Typography>
            <Typography
              variant="body2"
              color="error"
              component="span"
              fontWeight="bold"
            >
              {`${vocabulary}`}
            </Typography>
          </Grid>

          {audioUrl && (
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              <a href={audioUrl} target="_blank" rel="noopener noreferrer">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  {`Tổng điểm: `}
                </Typography>
                <Typography
                  variant="body2"
                  color="error"
                  component="span"
                  fontWeight="bold"
                >
                  {`${totalScore}`}
                </Typography>
              </a>
            </Grid>
          )}
        </Grid>
      )
    }
    return 'N/A'
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
            maxHeight: '90vh',
            overflowY: 'hidden',
            display: 'flex',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems={'center'}
              flex={1}
            >
              <CircularProgress />
            </Box>
          ) : resultData ? (
            <Box position={'relative'} flex={1} width={'100%'}>
              <Box
                mt={2}
                display="flex"
                justifyContent="flex-end"
                position={'absolute'}
                right={0}
                top={0}
              >
                <Button variant="contained" color="primary" onClick={onClose}>
                  Đóng
                </Button>
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Kết quả bài thi: {resultData.examTitle}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Bắt đầu: {new Date(resultData.startTime).toLocaleString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Kết thúc: {new Date(resultData.endTime).toLocaleString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Điểm tổng:{' '}
                <Typography
                  component="span"
                  variant="body1"
                  color={resultData.finalScore ? 'error' : 'textSecondary'}
                  fontWeight={resultData.finalScore ? 'bold' : 'normal'}
                >
                  {resultData.finalScore} / 10
                </Typography>
              </Typography>

              <Typography variant="body2" color="textSecondary" gutterBottom>
                Listening:{' '}
                <Typography
                  component="span"
                  color={
                    resultData.sectionScores?.Listening
                      ? 'error'
                      : 'textSecondary'
                  }
                  fontWeight={
                    resultData.sectionScores?.Listening ? 'bold' : 'normal'
                  }
                >
                  {resultData.sectionScores?.Listening || 0}
                </Typography>
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Reading:{' '}
                <Typography
                  component="span"
                  color={
                    resultData.sectionScores?.Reading
                      ? 'error'
                      : 'textSecondary'
                  }
                  fontWeight={
                    resultData.sectionScores?.Reading ? 'bold' : 'normal'
                  }
                >
                  {resultData.sectionScores?.Reading || 0}
                </Typography>
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Writing:{' '}
                <Typography
                  component="span"
                  color={
                    resultData.sectionScores?.Writing
                      ? 'error'
                      : 'textSecondary'
                  }
                  fontWeight={
                    resultData.sectionScores?.Writing ? 'bold' : 'normal'
                  }
                >
                  {resultData.sectionScores?.Writing || 0}
                </Typography>
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Speaking:{' '}
                <Typography
                  component="span"
                  color={
                    resultData.sectionScores?.Speaking
                      ? 'error'
                      : 'textSecondary'
                  }
                  fontWeight={
                    resultData.sectionScores?.Speaking ? 'bold' : 'normal'
                  }
                >
                  {resultData.sectionScores?.Speaking || 0}
                </Typography>
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ maxHeight: 'calc(100% - 250px)', mt: 2 }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">#</TableCell>
                      <TableCell align="center">Câu hỏi</TableCell>
                      <TableCell align="center">Nội dung</TableCell>
                      <TableCell align="center">Điểm</TableCell>
                      <TableCell align="center">Kết quả</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resultData.answers.map(
                      (answer: IReviewAnswer, index: number) => (
                        <TableRow key={answer.id}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            {answer.questionText}
                          </TableCell>
                          <TableCell align="center">
                            {answer.passageTitle}
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              color={
                                answer.writingScore?.totalScore || answer.score
                                  ? 'error'
                                  : 'textSecondary'
                              }
                              fontWeight={
                                answer.writingScore?.totalScore || answer.score
                                  ? 'bold'
                                  : 'normal'
                              }
                            >
                              {answer.writingScore?.totalScore ||
                                answer.score ||
                                'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {renderResultCell(answer)}
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Typography textAlign="center" color="error">
              Không tìm thấy dữ liệu kết quả
            </Typography>
          )}
        </Box>
      </Fade>
    </Modal>
  )
}

export default ReviewModal
