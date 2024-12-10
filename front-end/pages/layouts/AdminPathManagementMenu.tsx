import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { Divider, Tab, Tabs, Typography } from '@mui/material'
import PartsList from '@/pages/admin/question/components/part'

interface PathManagementMenuProps {
  examId: number
}
const AdminPathManagementMenu = (props: PathManagementMenuProps) => {
  const { examId } = props
  const [value, setValue] = useState<number>(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const section = useSelector((state: RootState) => state.examAdmin?.section)
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
    newSearchParams.delete('part')
    setSearchParams(newSearchParams)
    setValue(newValue)
  }
  const handleChoosePart = (idPart: number) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('part', String(idPart))
    setSearchParams(newSearchParams)
  }
  return (
    <>
      <Typography>Part</Typography>
      <Divider />
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
          sx={{ width: '100%', borderBottom: '1px solid rgba(0,0,0,0.12)' }}
          label="Chung"
          id="vertical-tab-0"
          aria-controls="vertical-tabpanel-0"
        />
        <Tab
          sx={{ width: '100%' }}
          label="Quản lý"
          id="vertical-tab-1"
          aria-controls="vertical-tabpanel-1"
        />
        {value === 1 && section && (
          <PartsList
            section={section}
            examId={examId}
            onChoose={handleChoosePart}
          />
        )}
      </Tabs>
    </>
  )
}
export default AdminPathManagementMenu
