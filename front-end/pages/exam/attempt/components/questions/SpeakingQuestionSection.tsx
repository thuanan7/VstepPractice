import { Grid, Box, Button, Typography } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import StopIcon from '@mui/icons-material/Stop'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import { IAttemptQuestion } from '@/features/exam/type'
import { useDispatch, useSelector } from 'react-redux'
import { saveAnswer } from '@/features/exam/attemptSlice'
import { selectAnswerWritingSpeaking } from '@/features/exam/attemptSelector'
//import { useReactMediaRecorder } from 'react-media-recorder'
import { useState, useRef } from 'react'

interface SingleQuestionSectionProps {
  questions: IAttemptQuestion[]
}

const SpeakingQuestionSection = ({ questions }: SingleQuestionSectionProps) => {
  const dispatch = useDispatch()
  const answerDictionary = useSelector(selectAnswerWritingSpeaking)
  const [playingQuestionId, setPlayingQuestionId] = useState<number | null>(
    null,
  )
  const [currentTime, setCurrentTime] = useState<number>(0)

  const handleSaveAudio = (questionId: number, blobUrl: string) => {
    dispatch(saveAnswer({ id: questionId, answer: blobUrl }))
  }

  const handlePlayAudio = (questionId: number, audioUrl: string) => {
    const audio = new Audio(audioUrl)
    setPlayingQuestionId(questionId)
    audio.play()

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime)
    }

    audio.onended = () => {
      setPlayingQuestionId(null)
      setCurrentTime(0)
    }
  }

  return (
    <Box>
      {questions.map((question, index) => (
        <Box
          key={question.id}
          sx={{
            marginBottom: 3,
            padding: 2,
            borderRadius: '8px',
            backgroundColor: '#E3F2FD',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Câu hỏi {index + 1}
            </Typography>
          </Box>
          <Typography
            sx={{
              whiteSpace: 'pre-wrap',
              marginBottom: 1,
              color: '#37474F',
            }}
          >
            {question.questionText}
          </Typography>

          <AudioRecorder questionId={question.id} onSave={handleSaveAudio} />

          {answerDictionary[question.id] && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                marginTop: 2,
                alignItems: 'center',
              }}
            >
              <Button
                variant="contained"
                startIcon={
                  playingQuestionId === question.id ? (
                    <PauseIcon />
                  ) : (
                    <PlayArrowIcon />
                  )
                }
                onClick={() => {
                  if (playingQuestionId === question.id) {
                    setPlayingQuestionId(null)
                  } else {
                    handlePlayAudio(question.id, answerDictionary[question.id])
                  }
                }}
                sx={{ fontSize: '16px', padding: '10px 20px' }}
              >
                {playingQuestionId === question.id
                  ? 'Đang phát...'
                  : 'Nghe lại'}
              </Button>
              {playingQuestionId === question.id && (
                <Typography variant="body2" sx={{ color: '#37474F' }}>
                  {`Thời gian: ${currentTime.toFixed(1)} giây`}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}

interface AudioRecorderProps {
  questionId: number
  onSave: (questionId: number, blobUrl: string) => void
}

const AudioRecorder = ({ questionId, onSave }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120); // 120-second countdown
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Refs for managing recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Start recording
  const startRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    audioChunks.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const blobUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(blobUrl);
        onSave(questionId, blobUrl); // Pass the recorded audio back
        setRemainingTime(120); // Reset timer
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start the timer
      let timeLeft = 120;
      setRemainingTime(timeLeft);
      timerRef.current = setInterval(() => {
        timeLeft -= 1;
        setRemainingTime(timeLeft);

        if (timeLeft <= 0) {
          stopRecording();
        }
      }, 1000);

      drawWaveform();
    } catch (error) {
      console.error("Error accessing the microphone:", error);
      alert("Unable to access the microphone. Please check your device settings.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current.stop();
    }

    if (analyserRef.current) {
      const audioContext = analyserRef.current.context;
      audioContext.close();
      analyserRef.current = null;
    }

    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Draw the waveform
  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext("2d")!;
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.fftSize);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);

      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.fillStyle = "rgb(200, 200, 200)";
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);

      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = "rgb(0, 0, 0)";
      canvasContext.beginPath();

      const sliceWidth = (canvas.width * 1.0) / analyser.fftSize;
      let x = 0;

      for (let i = 0; i < analyser.fftSize; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasContext.lineTo(canvas.width, canvas.height / 2);
      canvasContext.stroke();

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  return (
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          container
          justifyContent="center"
          alignItems="center"
          textAlign="center">
        {isRecording ? (
          <Button
            variant="contained"
            color="error"
            startIcon={<StopIcon />}
            onClick={stopRecording}
            sx={{ fontSize: "16px", padding: "10px 20px" }}
          >
            Dừng
          </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<MicIcon />}
              onClick={startRecording}
              sx={{ fontSize: "16px", padding: "10px 20px" }}
            >
              Ghi âm
            </Button>
          )}
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <canvas
            ref={canvasRef}
            width={400}
            height={100}
            style={{ backgroundColor: "#f5f5f5", marginTop: "16px" }}
          />
        </Grid>
      </Grid>
  )
}

export default SpeakingQuestionSection
