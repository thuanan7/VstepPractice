import { Grid, Box, Typography, Button } from '@mui/material'
import { SpeakingQuestion } from '@/features/exam/type'
import React, { useState, useRef, useEffect } from 'react';

interface SpeakingSectionProps {
  currentPart: SpeakingQuestion
}

const SpeakingSection: React.FC<SpeakingSectionProps> = ({
  currentPart,
}) => {
  // State for recording and playback
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(120); // Countdown timer
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // To store the timeout reference
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Start recording
  const startRecording = async () => {
    // Reset any ongoing animations or timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    audioChunks.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
  
      analyser.fftSize = 2048; // Resolution of the frequency bins
      source.connect(analyser);
      analyserRef.current = analyser;
  
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];
  
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
  
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        audioChunks.current = []; // Clear chunks after recording
        setRemainingTime(120); // Reset timer
      };
  
      mediaRecorder.start();
      setIsRecording(true);
  
      // Countdown timer for 120 seconds
      let timeLeft = 120;
      setRemainingTime(timeLeft);
      timerRef.current = setInterval(() => {
        timeLeft -= 1;
        setRemainingTime(timeLeft);
  
        if (timeLeft <= 0) {
          stopRecording(); // Automatically stop after 120 seconds
        }
      }, 1000);
  
      // Start the waveform animation
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

    // Clear the timer if it's still running
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

  // Send audio to the backend for processing (e.g., Whisper API)
  const sendAudioToAPI = async () => {
    if (!audioUrl) return;

    const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      const response = await fetch("http://localhost:3000/api/transcribe-and-chat", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Transcription Result:", result);
      // Handle the response (e.g., display ChatGPT reply)
    } catch (error) {
      console.error("Error sending audio to API:", error);
    }
  };

    // Reset recording when currentPart changes
    useEffect(() => {
      // Stop any ongoing recording
      if (isRecording) {
        stopRecording();
      }
  
      // Reset states
      setAudioUrl(null);
      setRemainingTime(120);
      audioChunks.current = [];
      mediaRecorderRef.current = null;
    }, [currentPart]);

  return (
    <>
      <audio
        controls
        src="/Con Mua Ngang Qua (Part.2).mp3"
        style={{ width: '100%', marginBottom: 16 }}
      />
    <Grid container spacing={4}>
      {/* Left Column */}
      <Grid item xs={12} md={6}>
        <Typography variant='body1' gutterBottom>
          <b>{currentPart.title}</b><br />
          <b>{currentPart.questionText}</b>
        </Typography>
        { /* Thêm 1 picture nua */}
        
        {currentPart.questions.map((question) => (
          <Box key={question.id} sx={{ mt: 2 }}>
            { currentPart.id === 'S3' ? <b>Follow-up questions: </b> : "" }<br />
            { currentPart.id === 'S3' ? <b>Note: {question.questionText}</b> : <b>{question.questionText}</b> }
            <Typography>
              {question.options?.map((option, _) => (
                <p>- {option}</p>
              ))}
            </Typography>
          </Box>
        ))}
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} md={6}>
        <Typography variant="body2" color="textSecondary">
          {currentPart.speakingPrompt}
        </Typography>
        {/* Voice Recording Section */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color={isRecording ? "secondary" : "primary"}
            onClick={isRecording ? stopRecording : startRecording}
            sx={{ mr: 2 }}
          >
            {isRecording ? `Stop Recording (${remainingTime}s)` : "Start Recording"}
          </Button>

          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            style={{
              border: "1px solid black",
              marginTop: "16px",
              display: isRecording ? "block" : "none",
            }}
          ></canvas>

          {audioUrl && (
            <>
              <audio controls src={audioUrl} style={{ display: 'block', margin: '16px 0' }} />
              <Button variant="contained" color="success" onClick={sendAudioToAPI}>
                Send Answer
              </Button>
            </>
          )}
        </Box>
      </Grid>
    </Grid>
    </>
  )
}

export default SpeakingSection
