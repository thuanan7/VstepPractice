const axios = require('axios')
const openAIController = {}
openAIController.testConnection = async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `http://localhost:${process.env.AI_PORT}${req.originalUrl}`,
      data: req.body,
      headers: req.headers,
    })
    console.log('data from .netcore', response.data)
    res.status(response.status).json(response.data)
  } catch (error) {
    console.error('Error calling .NET Core API:', error.message)
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: 'Error calling .NET Core API' })
  }
}
module.exports = openAIController
