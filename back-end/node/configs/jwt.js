const jwt = require('jsonwebtoken')
const redisClient = require('./redisClient')

const ACCESS_TOKEN_EXPIRY = '1h'
const REFRESH_TOKEN_EXPIRY = '7d'

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.ACCESSTOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })
}

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.ACCESSTOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    },
  )
  redisClient.setEx(
    `refresh:${refreshToken}`,
    7 * 24 * 3600,
    JSON.stringify(user),
  ) // Store for 7 days
  return refreshToken
}

const invalidateTokens = (accessToken, refreshToken) => {
  redisClient.del(`auth:${accessToken}`)
  redisClient.del(`refresh:${refreshToken}`)
}

module.exports = { generateAccessToken, generateRefreshToken, invalidateTokens }
