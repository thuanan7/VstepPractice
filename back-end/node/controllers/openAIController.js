const axios = require('axios')
const openAIController = {}
openAIController.testConnection = async (req, res) => {
  try {
    const host = `http://localhost:${process.env.AI_PORT}/api/v1/StudentAttempt/test`
    console.log('url', host)
    const response = await axios({
      method: req.method,
      url: host,
      data: req.body,
      headers: req.headers,
    })
    res.status(response.status).json(response.data)
  } catch (error) {
    console.error('Error calling .NET Core API:', error.message)
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: 'Error calling .NET Core API' })
  }
}
module.exports = openAIController
