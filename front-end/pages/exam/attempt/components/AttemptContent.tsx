import React, { useState } from 'react'
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
const mockData = {
  passage: `
    Học lập trình không chỉ giúp bạn hiểu cách hoạt động của các phần mềm và công nghệ hiện đại, mà còn phát triển tư duy logic và khả năng giải quyết vấn đề. 
    Một lập trình viên giỏi không chỉ biết viết code mà còn hiểu cách tối ưu hóa hiệu suất và bảo trì mã nguồn.
    Các ngôn ngữ phổ biến như JavaScript, Python, và Java thường được sử dụng trong các dự án lớn nhờ vào sự linh hoạt và cộng đồng hỗ trợ mạnh mẽ.
  `,
}
const mockQuestions = [
  {
    id: 1,
    question:
      'Việc truy cập trực tiếp tới phần tử thứ i của chuỗi thường nên tránh, thay vào đó ta nên dùng:',
    options: [
      'ép kiểu char[]',
      'toArray(typeof(char))',
      'Tất cả đều đúng',
      'split("")',
    ],
    correctOption: 3,
    selectedOption: 3,
    status: 'correct',
    score: '1,00',
    explanation:
      'Bạn nên dùng phương thức split("") để tách chuỗi thành các phần tử riêng lẻ thay vì truy cập trực tiếp tới từng phần tử.',
  },
  {
    id: 2,
    question:
      'Hàm nào cho phép hiển thị số thực có chính xác 2 chữ số thập phân?',
    options: [
      'x.toExponential(2)',
      'x.toPrecision(2)',
      'x.toString("#.#")',
      'x.toFixed(2)',
    ],
    correctOption: 3,
    selectedOption: 3,
    status: 'correct',
    score: '1,00',
    explanation:
      'Phương thức toFixed(n) cho phép hiển thị số thực với đúng n chữ số thập phân. Đây là cách tốt nhất để hiển thị số thực có 2 chữ số thập phân.',
  },
  {
    id: 3,
    question:
      'Kết quả mảng numbers sau khi chạy đoạn lệnh sau\n\nvar numbers = [45, 4, 9, 16, 25];\nnumbers.filter(myFunction);\n\nfunction myFunction(value, index, array) {\n  return value > 18;\n}',
    options: ['[45]', '[45, 25]', '[16, 25]', '[4, 9]'],
    correctOption: 1,
    selectedOption: 1,
    status: 'correct',
    score: '1,00',
    explanation:
      'Phương thức filter() trả về mảng các giá trị lớn hơn 18 trong mảng gốc. Trong trường hợp này, kết quả là [45].',
  },
]

const QuestionList = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }
  return (
    <>
      <Box
        sx={{
          height: 'calc(80vh - 50px)',
          overflowY: 'auto',
          padding: 2,
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#FAFAFA',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Đoạn văn giới thiệu */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#37474F',
              marginBottom: 1,
              fontWeight: 'bold',
            }}
          >
            Giới thiệu:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#616161',
              whiteSpace: 'pre-wrap', // Hỗ trợ xuống dòng
            }}
          >
            Đây là một bài kiểm tra kiến thức cơ bản về lập trình. Vui lòng đọc
            kỹ câu hỏi và chọn câu trả lời chính xác. Điểm số sẽ được tính dựa
            trên số câu trả lời đúng.
          </Typography>
        </Box>
        <Box
          sx={{
            marginBottom: 3,
            padding: 2,
            backgroundColor: '#E3F2FD',
            borderRadius: '8px',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              color: '#37474F',
            }}
          >
            {mockData.passage}
          </Typography>
        </Box>
        {/* Danh sách câu hỏi */}
        {mockQuestions.map((question, index) => (
          <Box
            key={index}
            sx={{
              marginBottom: 3,
              padding: 2,
              borderRadius: '8px',
              backgroundColor: '#E3F2FD',
            }}
          >
            {/* Tiêu đề câu hỏi */}
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

            {/* Nội dung câu hỏi */}
            <Typography
              sx={{
                whiteSpace: 'pre-wrap',
                marginBottom: 1,
                color: '#37474F',
              }}
            >
              {question.question}
            </Typography>

            {/* Danh sách đáp án */}
            <FormControl component="fieldset">
              <RadioGroup value={question.selectedOption}>
                {question.options.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    value={optionIndex}
                    control={<Radio />}
                    label={option}
                    sx={{
                      color:
                        optionIndex === question.correctOption
                          ? '#4CAF50'
                          : '#000000',
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 2,
          padding: 1,
          backgroundColor: '#F0F0F0',
          borderRadius: '8px',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          startIcon={<ArrowBackIcon />}
          sx={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity: currentQuestionIndex === 0 ? 0.6 : 1, // Hiệu ứng khi disabled
          }}
        >
          Trở về trước
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={currentQuestionIndex === mockQuestions.length - 1}
          endIcon={<ArrowForwardIcon />}
          sx={{
            backgroundColor: '#6C3483',
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            opacity:
              currentQuestionIndex === mockQuestions.length - 1 ? 0.6 : 1,
          }}
        >
          Tiếp theo
        </Button>
      </Box>
    </>
  )
}

export default QuestionList
