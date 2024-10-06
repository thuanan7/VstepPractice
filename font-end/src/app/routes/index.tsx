import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PublicPageLayout, LoginPageLayout, AdminPageLayout } from '@/pages/layout';
import {
  NotFoundPage,
  HomePage,
  AdminDashboardPage,
  AdminWebsiteCrawlPage,
  EventManagementPage,
  LoginPage,
} from '@/pages';
import { PrivateRoute } from './PrivateRoute';
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PublicPageLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ':websiteId',
        element: <HomePage />,
      },
      {
        path: 'admin/login',
        element: <LoginPageLayout />,
        children: [
          {
            index: true,
            element: <LoginPage />,
          },
        ],
      },
      {
        path: 'admin',
        element: <AdminPageLayout />,
        children: [
          {
            index: true,
            element: (
              <PrivateRoute>
                <AdminWebsiteCrawlPage />
              </PrivateRoute>
            ),
          },
          {
            path: 'website-crawl',
            children: [
              {
                index: true,
                element: (
                  <PrivateRoute>
                    <AdminWebsiteCrawlPage />
                  </PrivateRoute>
                ),
              },
              {
                path: ':websiteId',
                element: <AdminWebsiteCrawlPage />,
                children: [
                  {
                    index: true,
                    element: (
                      <PrivateRoute>
                        <AdminDashboardPage />
                      </PrivateRoute>
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: 'events',
            children: [
              {
                index: true,
                element: (
                  <PrivateRoute>
                    <EventManagementPage />
                  </PrivateRoute>
                ),
              },
            ],
          },
        ],
      },
      {
        path: '/*',
        element: <NotFoundPage />,
      },
    ],
  },
];
