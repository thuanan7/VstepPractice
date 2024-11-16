import { Navigate, RouteObject } from 'react-router-dom'
import { MainLayout, AdminLayout } from '@/pages/layouts'
import {
  LoginPage,
  ExamPage,
  QuestionPage,
  AdminPage,
  StudentExamAttemptPage,
  StudentExamPage,
  NotFoundPage,
} from '@/pages'
import { PrivateRoute } from '@/app/routes/PrivateRoute'

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
            <AdminPage />
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
    element: (
      <PrivateRoute>
        <StudentExamPage />
      </PrivateRoute>
    ),
  },
  {
    path: 'exam/:id/attempt',
    element: (
      <PrivateRoute>
        <StudentExamAttemptPage />
      </PrivateRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
