import React from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { useParams, useSearchParams } from 'react-router-dom'
import ButtonPreview from './components/ButtonPreview'
import ListeningSection from './components/listening/ListeningSection'
import SectionPartsManagement from './SectionPartsManagement'
import PartsManagement from './PartsManagement'
import QuestionsManagement from './QuestionsManagement'

const ExamQuestionManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabValues = ['listening', 'reading', 'writing', 'speaking']
  const activeTab = searchParams.get('tab') || 'listening'
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ tab: newValue })
  }

  return (
    <Box
      sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100vh' }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Exam Sections"
          sx={{ flexGrow: 1 }}
        >
          {tabValues.map((tab) => (
            <Tab
              key={tab}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              value={tab}
            />
          ))}
        </Tabs>
        <ButtonPreview examId={id || ''} />
      </Box>

      <Box sx={{ mt: 2 }}>
        {activeTab === 'section-parts' && <SectionPartsManagement />}
        {activeTab === 'parts/:parentId' && <PartsManagement parentId={0} />}
        {activeTab === '/questions/:sectionId' && (
          <QuestionsManagement sectionId={0} />
        )}

        {activeTab === 'listening' && <ListeningSection />}
        {activeTab === 'reading' && <div>Reading Content</div>}
        {activeTab === 'writing' && <div>Writing Content</div>}
        {activeTab === 'speaking' && <div>Speaking Content</div>}
      </Box>
    </Box>
  )
}

export default ExamQuestionManagement
