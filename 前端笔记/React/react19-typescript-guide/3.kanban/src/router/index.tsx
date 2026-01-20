// 路由定义

import { createBrowserRouter } from 'react-router-dom';
import { BoardPage } from '@/pages/Borad';

// 先定义路由
const routes = [
    {
        path: '/',
        element: <div>Home</div>
    },
    {
        path: '/board',
        element: <BoardPage />
    }
];

// createBrowserRouter
// createHashRouter
// createMemoryRouter
// createStaticRouter
export const router = createBrowserRouter(routes);
