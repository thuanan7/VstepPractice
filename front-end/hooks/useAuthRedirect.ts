import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { RootState } from '@/app/store'
import { Role } from '@/features/auth/configs'

const useAuthRedirect = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { accessToken, user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!accessToken) {
      if (location.pathname !== '/users/login') {
        navigate('/users/login')
      }
    } else if (user) {
      if (user.role === Role.STUDENT) {
        navigate('/exam')
      } else if (user.role === Role.ADMIN || user.role === Role.TEACHER) {
        navigate('/admin')
      }
    }
  }, [accessToken, user, navigate, location.pathname])
}

export default useAuthRedirect
