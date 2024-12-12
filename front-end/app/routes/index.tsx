import { Navigate, RouteObject } from 'react-router-dom'
import { MainLayout, AdminLayout, StudentLayout } from '@/pages/layouts'
import {
  LoginPage,
  ExamPage,
  QuestionPage,
  StudentExamAttemptPage,
  StudentExamResultPage,
  StudentExamSubmitPage,
  StudentStartAttemptPage,
  StudentExamPage,
  NotFoundPage,
} from '@/pages'
import { PrivateRoute } from '@/app/routes/PrivateRoute'
import { Role } from '@/features/auth/configs.ts'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/users/login" replace />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <ExamPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'exams',
        element: (
          <PrivateRoute>
            <ExamPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'questions',
        element: (
          <PrivateRoute>
            <QuestionPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'questions/:id',
        element: (
          <PrivateRoute>
            <QuestionPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: 'users/login',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: 'exam',
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <StudentExamPage />
          </PrivateRoute>
        ),
      },
      {
        path: ':id/attempt',
        element: (
          <PrivateRoute>
            <StudentExamAttemptPage />
          </PrivateRoute>
        ),
      },
      {
        path: ':id/attempt/start',
        element: (
          <PrivateRoute>
            <StudentStartAttemptPage />
          </PrivateRoute>
        ),
      },
      {
        path: ':id/result',
        element: (
          <PrivateRoute>
            <StudentExamResultPage />
          </PrivateRoute>
        ),
      },
      {
        path: ':id/submit',
        element: (
          <PrivateRoute>
            <StudentExamSubmitPage />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
]

export const allowedRoutes = {
  [Role.STUDENT]: [
    '/exam',
    '/exam/:id/attempt',
    '/exam/:id/attempt/start',
    '/exam/:id/submit',
    '/exam/:id/result',
  ],
  [Role.ADMIN]: null,
  [Role.TEACHER]: null,
}
