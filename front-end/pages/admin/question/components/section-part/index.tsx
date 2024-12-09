import React, { useEffect, useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import PartsManagement from '../part'
import SessionGeneral from './SessionGeneral'
import { ISessionPart } from '@/features/exam/type.ts'
interface SessionManagementProps {
  session: ISessionPart
  examId: number
}
const SessionManagement = (props: SessionManagementProps) => {
  const { session, examId } = props
  const [value, setValue] = useState<number>(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  useEffect(() => {
    if (tabParam) {
      setValue(Number(tabParam))
    } else {
      const currentParams = new URLSearchParams(searchParams)
      currentParams.set('tab', '0')
      setSearchParams(currentParams)
    }
  }, [tabParam])

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('tab', String(newValue))
    setSearchParams(newSearchParams)
    setValue(newValue)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          borderRight: 1,
          borderColor: 'divider',
          width: 100,
        }}
      >
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          aria-label="session management tabs"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '& .MuiTab-root': {
              padding: '6px 16px',
              fontSize: '14px',
              color: 'text.primary',
              marginBottom: '8px',
              transition: 'background-color 0.3s ease, color 0.3s ease',
            },
            '& .Mui-selected': {
              color: 'text.secondary',
            },
            '& .MuiTabs-flexContainer': {
              alignItems: 'flex-start',
            },
          }}
        >
          <Tab
            label="Câu hỏi"
            id="vertical-tab-0"
            aria-controls="vertical-tabpanel-0"
          />
          <Tab
            label="Chung"
            id="vertical-tab-1"
            aria-controls="vertical-tabpanel-1"
          />
        </Tabs>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {value === 1 ? (
          <SessionGeneral session={session} examId={examId} />
        ) : (
          <PartsManagement />
        )}
      </Box>
    </Box>
  )
}

export default SessionManagement