const axios = require('axios')
const { getGatewayJwtToken } = require('../configs/jwt')
const openAIController = {}
openAIController.testConnection = async (req, res) => {
  try {
    const host = `http://localhost:${process.env.NETCORE_PORT}/api/v1/StudentAttempt/test`
    const token = getGatewayJwtToken()
    console.log('url', host)
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
module.exports = openAIController
