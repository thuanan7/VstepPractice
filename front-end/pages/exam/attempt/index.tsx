import React, { useEffect, useState, useMemo } from 'react'
import { Box, Button, Grid, Paper } from '@mui/material'
//import { VSTEPExamConfig } from './fake'
import AttemptTabs from '@/pages/exam/attempt/components/AttemptTabs'
import TableQuestion from '@/pages/exam/attempt/components/TableQuestion'
import SpeakingSection from '@/pages/exam/attempt/components/SpeakingSection'
import WritingSection from '@/pages/exam/attempt/components/WritingSection'
import ReadingSection from '@/pages/exam/attempt/components/ReadingSection'
import ListeningSection from '@/pages/exam/attempt/components/ListeningSection'
import { useNavigate } from 'react-router-dom'

const ExamPage: React.FC = () => {
  const navigate = useNavigate()
  const [examConfig, setExamConfig] = useState<{ sections: any[] }>({ sections: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchExamConfig = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/data');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        //console.log(data);
        setExamConfig(data);
      } catch (error: any) {
        setFetchError(error.message || 'Unexpected error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExamConfig();
  }, []);

  const flatQuestions = useMemo(() => {
    if (!examConfig.sections || examConfig.sections.length === 0) return [];
    return examConfig.sections.flatMap((section, sectionIndex) =>
      section.sectionPart.map((part, partIndex) => ({
        ...part,
        sectionIndex,
        partIndex,
      }))
    );
  }, [examConfig.sections]);

  // console.log(flatQuestions);
  //console.log("answers: ");
  //console.log(answers);

  useEffect(() => {
    //console.log("useEffect currentQuestion.sectionIndex: "+currentQuestion.sectionIndex)
    if (currentPart) {
      setCurrentSectionIndex(currentPart.sectionIndex);
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [currentPartIndex])

  useEffect(() => {
    if (flatQuestions.length > 0 && currentPartIndex >= flatQuestions.length) {
      setCurrentPartIndex(0);
    }
  }, [flatQuestions, currentPartIndex]);

  const currentPart = 
    flatQuestions && currentPartIndex >= 0 && currentPartIndex < flatQuestions.length
      ? flatQuestions[currentPartIndex]
      : null;
  
  const currentSection = currentPart?.sectionIndex >= 0 &&
    currentPart?.sectionIndex < examConfig.sections.length
    ? examConfig.sections[currentPart.sectionIndex]
    : null;  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (fetchError) {
    return <div>Error: {fetchError}</div>;
  }

  if (!currentPart || !currentSection) {
    return <div>No data available for this section.</div>;
  }

  const findFirstPartIndexOfSection = (sectionIndex: number) => {
    return flatQuestions.findIndex((q) => q.sectionIndex === sectionIndex)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    //console.log(answer);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNextQuestion = () => {
    if (currentPartIndex < flatQuestions.length - 1) {
      setCurrentPartIndex((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex((prev) => prev - 1)
    }
  }

  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex)
    const firstPartIndex = findFirstPartIndexOfSection(sectionIndex)
    setCurrentPartIndex(firstPartIndex)
  }

  const handlePartClick = (partIndex: number) => {
    setCurrentPartIndex(partIndex)
    // Chi hien thi cac part tong section nen ko can
    //setCurrentSectionIndex(flatQuestions[partIndex].sectionIndex)
    // console.log("handleQuestionClick-questionIndex: "+questionIndex)
    // console.log("handleQuestionClick - flatQuestions[questionIndex].sectionIndex: "+flatQuestions[questionIndex].sectionIndex);
  }

  const handleSubmit = () => {
    navigate('/exam/1/submit')
  }

  return (
    <Grid container spacing={2} sx={{ height: '100vh', padding: 2 }}>
      <AttemptTabs
        tabs={examConfig.sections.map((x) => x.title)}
        active={currentSectionIndex}
        onChoose={handleSectionChange}
      />
      <Grid item xs={8} sx={{ position: 'relative' }}>
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            paddingBottom: 10,
            overflowY: 'auto',
            height: 'calc(100vh - 100px)',
          }}
        >
          {currentSection.type === 'listening' &&
            currentPart.type === 'audio' && (
              <ListeningSection
                currentPart={currentPart}
                answers={answers}
                handleAnswerChange={handleAnswerChange}
              />
            )}

          {currentSection.type === 'reading' &&
            currentPart.type === 'multiple-choice' && (
              <ReadingSection
                currentSection={currentSection}
                currentPart={currentPart}
                answers={answers}
                handleAnswerChange={handleAnswerChange}
              />
            )}

          {currentSection.type === 'writing' &&
            currentPart.type === 'essay' && (
              <WritingSection
                currentPart={currentPart}
                answers={answers}
                handleAnswerChange={handleAnswerChange}
              />
            )}

          {currentSection.type === 'speaking' &&
            currentPart.type === 'speaking' && (
              <SpeakingSection currentPart={currentPart} />
            )}
        </Paper>

        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: '16%',
            right: '16%',
            backgroundColor: 'white',
            padding: 2,
            boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            variant="outlined"
            disabled={currentPartIndex === 0}
            onClick={handlePreviousQuestion}
          >
            Previous Part
          </Button>
          {currentPartIndex === flatQuestions.length - 1 ? (
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Submit Exam
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNextQuestion}>
              Next Part
            </Button>
          )}
        </Box>
      </Grid>

      <TableQuestion
        // mang flatQuestions phai duoc sort theo id roi
        data={flatQuestions.map((item, index) => item.sectionIndex === currentSectionIndex ? index : -1 )}
        onChoose={handlePartClick}
        onAutoSubmit={handleSubmit}
        active={currentPartIndex}
        currentSectionIndex={currentSectionIndex}
        totalAnswerOnPart={Object.keys(answers).filter(obj => obj.includes(flatQuestions[currentPartIndex].id)).length || 0}
        totalQuestions={(() => { try { return flatQuestions[currentPartIndex].questions.length ; } catch { return 0; }})()}
      />
    </Grid>
  )
}

export default ExamPage
