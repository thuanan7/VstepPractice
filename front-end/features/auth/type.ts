import { Role } from './configs.ts'

export interface IUser {
  id: number
  role: Role
  lastName: String
  firstName: String
}

export interface IResLogin {
  accessToken: string
  refreshToken: string
  user: IUser
}
