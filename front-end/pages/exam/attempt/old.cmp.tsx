import React, { useEffect, useState, useMemo } from 'react'
import { Grid, Paper } from '@mui/material'
import SpeakingSection from '@/pages/exam/attempt/components/SpeakingSection'
import { useNavigate, useParams } from 'react-router-dom'

import { attemptRequest } from '@/app/api'
import { toast } from 'react-hot-toast'
import { IAttemptExam } from '@/features/exam/type.ts'
import { SessionType } from '@/features/exam/configs.ts'

const ExamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [examConfig, setExamConfig] = useState<IAttemptExam[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentPartIndex, setCurrentPartIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      toast.error('Invalid exam ID!')
      navigate('/exam')
      return
    }
    const checkExamId = async () => {
      try {
        setIsLoading(true)
        const response = await attemptRequest.getAttemptByExamId(id)
        if (!response) {
          toast.error('Invalid exam ID!')
          navigate('/exam')
          return
        } else {
          setExamConfig(response)
        }
      } catch (error) {
        toast.error('Không tìm thấy đề thi')
        navigate('/exam')
      } finally {
        setIsLoading(false)
      }
    }
    void checkExamId()
  }, [id, navigate])

  const [crrSection, crrPart] = useMemo(() => {
    if (
      currentSectionIndex >= 0 &&
      currentPartIndex >= 0 &&
      examConfig.length
    ) {
      if (currentSectionIndex > examConfig.length) {
        setCurrentSectionIndex(0)
      } else {
        const section = examConfig[currentSectionIndex]
        if (!section || currentPartIndex > section.parts.length) {
          setCurrentPartIndex(0)
        }
        return [section, section.parts[currentPartIndex]]
      }
    } else {
      setCurrentSectionIndex(0)
      setCurrentPartIndex(0)
    }
    return [undefined, undefined]
  }, [examConfig, currentSectionIndex, currentPartIndex])
  console.log('dsadsa')
  //
  // const flatQuestions = useMemo(() => {
  //   if (!examConfig.sections || examConfig.sections.length === 0) return []
  //   return examConfig.sections.flatMap((section, sectionIndex) =>
  //     section.sectionPart.map((part, partIndex) => ({
  //       ...part,
  //       sectionIndex,
  //       partIndex,
  //     })),
  //   )
  // }, [examConfig.sections])
  // useEffect(() => {
  //   if (currentPart) {
  //     setCurrentSectionIndex(currentPart.sectionIndex)
  //   }
  //   document.body.style.overflow = 'hidden'
  //   return () => {
  //     document.body.style.overflow = 'auto'
  //   }
  // }, [currentPartIndex])

  // useEffect(() => {
  //   if (flatQuestions.length > 0 && currentPartIndex >= flatQuestions.length) {
  //     setCurrentPartIndex(0)
  //   }
  // }, [flatQuestions, currentPartIndex])
  //
  // const currentPart =
  //   flatQuestions &&
  //   currentPartIndex >= 0 &&
  //   currentPartIndex < flatQuestions.length
  //     ? flatQuestions[currentPartIndex]
  //     : null

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (fetchError) {
    return <div>Error: {fetchError}</div>
  }

  if (!crrSection || !crrPart) {
    return <div>No data available for this section.</div>
  }
  //
  // const findFirstPartIndexOfSection = (sectionIndex: number) => {
  //   return flatQuestions.findIndex((q) => q.sectionIndex === sectionIndex)
  // }
  //
  const handleAnswer = (questionId: number, option: number) => {
    // setAnswers((prev) => ({
    //   ...prev,
    //   [questionId]: answer,
    // }))
  }
  //
  // const handleNextQuestion = () => {
  //   if (currentPartIndex < flatQuestions.length - 1) {
  //     setCurrentPartIndex((prev) => prev + 1)
  //   }
  // }
  //
  // const handlePreviousQuestion = () => {
  //   if (currentPartIndex > 0) {
  //     setCurrentPartIndex((prev) => prev - 1)
  //   }
  // }
  //
  const handleSectionChange = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex)
    setCurrentPartIndex(0)
  }
  //
  // const handlePartClick = (partIndex: number) => {
  //   setCurrentPartIndex(partIndex)
  //   // Chi hien thi cac part tong section nen ko can
  //   //setCurrentSectionIndex(flatQuestions[partIndex].sectionIndex)
  //   // console.log("handleQuestionClick-questionIndex: "+questionIndex)
  //   // console.log("handleQuestionClick - flatQuestions[questionIndex].sectionIndex: "+flatQuestions[questionIndex].sectionIndex);
  // }
  //
  // const handleSubmit = () => {
  //   navigate('/exam/1/submit')
  // }

  return (
    <Grid container spacing={2} sx={{ height: '100vh', padding: 2 }}>
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
          {/*{currentSection.type === 'writing' &&*/}
          {/*  currentPart.type === 'essay' && (*/}
          {/*    <WritingSection*/}
          {/*      currentPart={currentPart}*/}
          {/*      answers={answers}*/}
          {/*      handleAnswerChange={handleAnswerChange}*/}
          {/*    />*/}
          {/*  )}*/}
          {crrSection.sectionType === SessionType.Speaking && (
            <SpeakingSection part={crrPart} />
          )}
        </Paper>
        {/*<Box*/}
        {/*  sx={{*/}
        {/*    position: 'fixed',*/}
        {/*    bottom: 0,*/}
        {/*    left: '16%',*/}
        {/*    right: '16%',*/}
        {/*    backgroundColor: 'white',*/}
        {/*    padding: 2,*/}
        {/*    boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',*/}
        {/*    display: 'flex',*/}
        {/*    justifyContent: 'space-between',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Button*/}
        {/*    variant="outlined"*/}
        {/*    disabled={currentPartIndex === 0}*/}
        {/*    onClick={handlePreviousQuestion}*/}
        {/*  >*/}
        {/*    Previous Part*/}
        {/*  </Button>*/}
        {/*  {currentPartIndex === flatQuestions.length - 1 ? (*/}
        {/*    <Button variant="contained" color="success" onClick={handleSubmit}>*/}
        {/*      Submit Exam*/}
        {/*    </Button>*/}
        {/*  ) : (*/}
        {/*    <Button variant="contained" onClick={handleNextQuestion}>*/}
        {/*      Next Part*/}
        {/*    </Button>*/}
        {/*  )}*/}
        {/*</Box>*/}
      </Grid>
      {/*<TableQuestion*/}
      {/*  data={flatQuestions.map((item, index) =>*/}
      {/*    item.sectionIndex === currentSectionIndex ? index : -1,*/}
      {/*  )}*/}
      {/*  onChoose={handlePartClick}*/}
      {/*  onAutoSubmit={handleSubmit}*/}
      {/*  active={currentPartIndex}*/}
      {/*  currentSectionIndex={currentSectionIndex}*/}
      {/*  totalAnswerOnPart={*/}
      {/*    Object.keys(answers).filter((obj) =>*/}
      {/*      obj.includes(flatQuestions[currentPartIndex].id),*/}
      {/*    ).length || 0*/}
      {/*  }*/}
      {/*  totalQuestions={(() => {*/}
      {/*    try {*/}
      {/*      return flatQuestions[currentPartIndex].questions.length*/}
      {/*    } catch {*/}
      {/*      return 0*/}
      {/*    }*/}
      {/*  })()}*/}
      {/*/>*/}
    </Grid>
  )
}

export default ExamPage
