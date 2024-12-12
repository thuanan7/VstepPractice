const axios = require('axios')
const { getGatewayJwtToken } = require('../configs/jwt')
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

    res.status(response.status).json({ data: response.data, success: true, message: 'Start attempt successfully' })
  } catch (error) {
    console.error('Error calling .NET Core API:', error.message)
    res
      .status(error.response ? error.response.status : 500)
      .json({
        message: 'Error calling .NET Core API', success: false
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

module.exports = openAIController
