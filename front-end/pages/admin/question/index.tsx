import React, { useEffect, useState } from 'react'
import { Box, Tabs, Tab, IconButton, Typography } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { sectionPartRequest } from '@/app/api'
import { ISessionPart } from '@/features/exam/type'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CreateOrUpdateSection from './components/section-part/CreateOrUpdateSection'
import RemoveSession from './components/section-part/RemoveSession'
const ExamQuestionManagement: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [sectionParts, setSectionParts] = useState<ISessionPart[] | undefined>(
    undefined,
  )
  const [section, setSession] = useState<ISessionPart | undefined>(undefined)
  const [searchParams, setSearchParams] = useSearchParams()
  const sTab = searchParams.get('session')
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    const currentParams = new URLSearchParams(searchParams)
    currentParams.set('session', newValue)
    setSearchParams(currentParams)
  }
  useEffect(() => {
    if (id) {
      void fetchSectionParts()
    } else {
      navigate('admin/exams')
      //
    }
  }, [id])
  useEffect(() => {
    if (sectionParts && sTab) {
      const findIndex = sTab
        ? sectionParts.findIndex((x) => `${x.id}` === sTab)
        : -1
      if (findIndex === -1) {
        setSearchParams({ tab: `${sectionParts[0].id}` })
      } else {
        setSession(sectionParts[findIndex])
      }
    }
  }, [sectionParts, sTab])
  const fetchSectionParts = async () => {
    const response = await sectionPartRequest.sectionPartsById(
      parseInt(`${id}`),
    )
    if (response && response.length > 0) {
      setSectionParts(response)
      if (!sTab) {
        // @ts-ignore
        handleTabChange({}, `${response[0].id}`)
      }
    } else {
    }
  }
  const handleBack = () => {
    navigate('/admin/exams', { replace: true })
  }
  const handleRefresh = () => {
    navigate(0, { replace: true })
  }
  if (!id) return <div>Error</div>
  if (!sectionParts || !sTab) return <div>Waiting</div>
  return (
    <Box
      sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh' }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <IconButton onClick={handleBack} sx={{ color: 'primary.main' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1, overflowX: 'auto' }}>
          <Tabs
            value={section?.id}
            onChange={handleTabChange}
            aria-label="Exam Sections"
            sx={{
              width: 500,
              flexGrow: 1,
              minWidth: 'fit-content',
              whiteSpace: 'nowrap',
            }}
          >
            {sectionParts.map((tab, index: number) => (
              <Tab
                key={`${tab.id}_${index}`}
                label={`${tab.title}`}
                value={tab.id}
              />
            ))}
          </Tabs>
        </Box>
        <CreateOrUpdateSection examId={id} onRefresh={handleRefresh} />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row' }} gap={2}>
          <Box flex={1}>
            <Typography>{section?.content}</Typography>
            <Typography>{section?.instructions}</Typography>
          </Box>
          <RemoveSession id={section?.id || 0} onRefresh={handleRefresh} />
          <CreateOrUpdateSection
            examId={id}
            id={section?.id}
            onRefresh={handleRefresh}
          />
        </Box>

        {/*<PartsManagement parentId={section?.id} />*/}
        {/*<SectionPartsManagement />*/}
        {/*{activeTab === 'section-parts' && <SectionPartsManagement />}*/}
        {/*{activeTab === 'parts/:parentId' && <PartsManagement parentId={0} />}*/}
        {/*{activeTab === '/questions/:sectionId' && (*/}
        {/*  <QuestionsManagement sectionId={0} />*/}
        {/*)}*/}

        {/*{activeTab === 'listening' && <ListeningSection />}*/}
        {/*{activeTab === 'reading' && <div>Reading Content</div>}*/}
        {/*{activeTab === 'writing' && <div>Writing Content</div>}*/}
        {/*{activeTab === 'speaking' && <div>Speaking Content</div>}*/}
      </Box>
    </Box>
  )
}

export default ExamQuestionManagement
