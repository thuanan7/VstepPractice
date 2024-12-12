import React, { useState } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'

// Dữ liệu mẫu
const mockSkills = [
  'Hướng dẫn cài đặt NodeJS',
  'Hướng dẫn cài đặt Visual Studio Code',
  'Hướng dẫn cài đặt PostgreSQL',
  'BackEnd Web Developer Roadmap',
  'JavaScript - Phần 1',
  'Quiz - JavaScript',
  'Lab JavaScript cơ bản',
  'Debug NodeJS Visual Studio Code',
  'Global Object',
]

const EnhancedUI = () => {
  const [activeSkill, setActiveSkill] = useState<number | null>(null)

  const handleSkillClick = (index: number) => {
    setActiveSkill(index)
  }

  return (
    <Box display="flex" justifyContent="space-between">
      <Box
        sx={{
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: 2,
          backgroundColor: '#F8F8FF',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          sx={{ marginBottom: 2, fontWeight: 'bold', color: 'text.secondary' }}
        >
          Danh sách kỹ năng
        </Typography>
        <List>
          {mockSkills.map((skill, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => handleSkillClick(index)}
                sx={{
                  backgroundColor:
                    activeSkill === index ? 'text.secondary' : 'inherit', // Màu nền xanh khi active
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#D8BFD8',
                    color: 'text.secondary',
                  },
                  padding: '10px',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    color: activeSkill === index ? '#FFFFFF' : 'inherit',
                    fontWeight: activeSkill === index ? 'bold' : 'normal',
                  }}
                >
                  {skill}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
}

export default EnhancedUI
