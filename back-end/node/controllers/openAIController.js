const axios = require('axios')
const { getGatewayJwtToken } = require('../configs/jwt')

const {
  hostStudentSection,
  typeSections,
  fnParseData,
} = require('../configs/enums')
const openAIController = {}

openAIController.testConnection = async (req, res) => {
  try {
    const host = `http://localhost:${process.env.NETCORE_PORT}/api/v1/StudentAttempt/test`
    const token = getGatewayJwtToken()
    const response = await axios({
      method: req.method,
      url: host,
      data: req.body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    res.status(response.status).json(response.data)
  } catch (error) {
    console.error('Error calling .NET Core API:', error.message)
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: 'Error calling .NET Core API' })
  }
}

openAIController.allAttempts = async (req, res) => {
  try {
    let examId = isNaN(req.params.examId) ? 0 : parseInt(`${req.params.examId}`)
    const host = `http://localhost:${process.env.NETCORE_PORT}/api/v1/StudentAttempt/attempts`
    const token = getGatewayJwtToken()
    const response = await axios({
      method: req.method,
      url: host,
      data: { ...req.body, userId: req.user.id, examId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    res.status(response.status).json({
      data: response.data,
      success: true,
      message: 'Get attempt successfully',
    })
  } catch (error) {
    console.error('Error', error.message)
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: 'Error calling .NET Core API' })
  }
}
openAIController.allExams = async (req, res) => {
  try {
    const host = `http://localhost:${process.env.NETCORE_PORT}/api/v1/StudentAttempt/exams`
    const token = getGatewayJwtToken()
    const response = await axios({
      method: req.method,
      url: host,
      data: req.body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    res.status(response.status).json({
      data: response.data,
      success: true,
      message: 'Get exam successfully',
    })
  } catch (error) {
    console.error('Error calling .NET Core API:', error.message)
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: 'Error calling .NET Core API' })
  }
}

openAIController.startStudentAttempt = async (req, res) => {
  try {
    const host = `http://localhost:${process.env.NETCORE_PORT}/api/v1/StudentAttempt/start`
    const token = getGatewayJwtToken()

    const response = await axios({
      method: req.method,
      url: host,
      data: { ...req.body, userId: req.user.id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    res.status(response.status).json({
      data: response.data,
      success: true,
      message: 'Start attempt successfully',
    })
  } catch (error) {
    console.error('Error calling .NET Core API:', error.message)
    res.status(error.response ? error.response.status : 500).json({
      message: 'Error calling .NET Core API',
      success: false,
    })
  }
}

openAIController.submitStudentAnswer = async (req, res) => {
  try {
    let id = isNaN(req.params.attemptId)
      ? 0
      : parseInt(`${req.params.attemptId}`)
    if (id > 0) {
      const host = `http://localhost:${process.env.NETCORE_PORT}/api/v1/StudentAttempt/${id}/submit-answer`
      const token = getGatewayJwtToken()
      const response = await axios({
        method: req.method,
        url: host,
        data: req.body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      res.status(response.status).json(response.data)
    } else {
      res.status(500).json({ error: 'Please send your attemptId' })
    }
  } catch (error) {
    console.error('Error calling .NET Core API:', error.message)
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: 'Error calling .NET Core API' })
  }
}

openAIController.finishStudentAnswer = async (req, res) => {
  try {
    let id = isNaN(req.params.attemptId)
      ? 0
      : parseInt(`${req.params.attemptId}`)
    if (id > 0) {
      const host = `http://localhost:${process.env.NETCORE_PORT}/api/v1/StudentAttempt/${id}/finish`
      const token = getGatewayJwtToken()
      const response = await axios({
        method: req.method,
        url: host,
        data: { ...req.body, userId: req.user.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      res.status(response.status).json({
        data: response.data,
        success: true,
        message: 'Finish attempt successfully',
      })
    } else {
      res.status(500).json({ error: 'Please send your attemptId' })
    }
  } catch (error) {
    console.log('dsadsa')
    console.error('Error calling .NET Core API:', error.message)
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: 'Error calling .NET Core API' })
  }
}

openAIController.resultStudentAnswer = async (req, res) => {
  try {
    let id = isNaN(req.params.attemptId)
      ? 0
      : parseInt(`${req.params.attemptId}`)
    const userId = req.query.userId
    if (id > 0 && userId) {
      const host = `http://localhost:${process.env.NETCORE_PORT}/api/v1/StudentAttempt/${id}/result?userId=${userId}`
      const token = getGatewayJwtToken()
      const response = await axios({
        method: req.method,
        url: host,
        data: req.body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      res.status(response.status).json(response.data)
    } else {
      res.status(500).json({ error: 'Please send your attemptId and userId' })
    }
  } catch (error) {
    console.error('Error calling .NET Core API:', error.message)
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: 'Error calling .NET Core API' })
  }
}

openAIController.submitStudentSection = async (req, res) => {
  try {
    const { section = '0', partId = '0', questions } = req.body
    let id = isNaN(req.params.attemptId)
      ? 0
      : parseInt(`${req.params.attemptId}`)
    console.log('aaaa', id)
    const token = getGatewayJwtToken()
    let typeSection = isNaN(section)
      ? typeSections.listening
      : parseInt(`${section}`)

    let sectionPartId = isNaN(partId) ? 0 : parseInt(`${partId}`)

    if (sectionPartId === 0 || !questions || questions.length === 0)
      return res.status(500).json({
        message: 'Need partId, TypeSection, Options',
        success: false,
      })

    if (id > 0) {
      const host = `http://localhost:${process.env.NETCORE_PORT}/api/v1/StudentAttempt/${id}/${hostStudentSection[typeSection]}`
      const userId = req.user.id
      const data = {
        userId: userId,
        scope: {
          type: 2,
          sectionPartId: sectionPartId,
        },
        answers: fnParseData[typeSection](questions),
      }
      const response = await axios({
        method: req.method,
        url: host,
        data: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      res.status(response.status).json(response.data)
    } else {
      res.status(500).json({ error: 'Please send your attemptId' })
    }
  } catch (error) {
    console.error('Error calling .NET Core API:', error.message)
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: 'Error calling .NET Core API' })
  }
}

module.exports = openAIController
