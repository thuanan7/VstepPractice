import {RouteObject} from 'react-router-dom';
import {MainLayout, AdminLayout} from '@/pages/layouts';
import {
    LoginPage,
    ExamPage,
    QuestionPage,
    AdminPage
} from '@/pages';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout/>,
        children: [
            {
                index: true,
                element: <LoginPage/>,
            },
            {
                path: 'admin',
                element: <AdminLayout/>,
                children: [
                    {
                        index: true,
                        element: (
                            <AdminPage/>
                        ),
                    },
                    {
                        path: 'exams',
                        element: (
                            <ExamPage/>
                        ),
                    },
                    {
                        path: 'questions',
                        element: (
                            <QuestionPage/>
                        ),
                    },
                    {
                        path: 'questions/:id',
                        element: (
                            <QuestionPage/>
                        ),
                    },
                ]
            }
            // {
            //     path: ':websiteId',
            //     element: <HomePage />,
            // },
            // {
            //     path: 'admin/login',
            //     element: <LoginPageLayout />,
            //     children: [
            //         {
            //             index: true,
            //             element: <LoginPage />,
            //         },
            //     ],
            // },
            // {
            //     path: 'admin',
            //     element: <AdminPageLayout />,
            //     children: [
            //         {
            //             index: true,
            //             element: (
            //                 <PrivateRoute>
            //                     <AdminWebsiteCrawlPage />
            //                 </PrivateRoute>
            //             ),
            //         },
            //         {
            //             path: 'website-crawl',
            //             children: [
            //                 {
            //                     index: true,
            //                     element: (
            //                         <PrivateRoute>
            //                             <AdminWebsiteCrawlPage />
            //                         </PrivateRoute>
            //                     ),
            //                 },
            //                 {
            //                     path: ':websiteId',
            //                     element: <AdminWebsiteCrawlPage />,
            //                     children: [
            //                         {
            //                             index: true,
            //                             element: (
            //                                 <PrivateRoute>
            //                                     <AdminDashboardPage />
            //                                 </PrivateRoute>
            //                             ),
            //                         },
            //                     ],
            //                 },
            //             ],
            //         },
            //         {
            //             path: 'events',
            //             children: [
            //                 {
            //                     index: true,
            //                     element: (
            //                         <PrivateRoute>
            //                             <EventManagementPage />
            //                         </PrivateRoute>
            //                     ),
            //                 },
            //             ],
            //         },
            //     ],
            // },
            // {
            //     path: '/*',
            //     element: <NotFoundPage />,
            // },
        ],
    },
];
