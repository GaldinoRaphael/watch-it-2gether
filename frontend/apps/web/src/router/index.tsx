import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { GroupsPage } from '../pages/GroupsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AuthGuard } from '../features/auth/guards/AuthGuard';
import { GuestGuard } from '../features/auth/guards/GuestGuard';

export const router = createBrowserRouter([
  {
    path: '/invite/:token',
    lazy: () =>
      import('../pages/InvitePage').then((m) => ({ Component: m.InvitePage })),
  },
  {
    element: <GuestGuard />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/groups" replace /> },
          { path: 'groups', element: <GroupsPage /> },
          {
            path: 'groups/:groupId',
            lazy: () =>
              import('../pages/GroupDetailPage').then((m) => ({ Component: m.GroupDetailPage })),
          },
          {
            path: 'groups/:groupId/add-movie',
            lazy: () =>
              import('../pages/AddMoviePage').then((m) => ({ Component: m.AddMoviePage })),
          },
          {
            path: 'groups/:groupId/add-movie/rate',
            lazy: () =>
              import('../pages/RateMoviePage').then((m) => ({ Component: m.RateMoviePage })),
          },
          {
            path: 'groups/:groupId/pending-votes',
            lazy: () =>
              import('../pages/PendingVotesPage').then((m) => ({ Component: m.PendingVotesPage })),
          },
          {
            path: 'groups/:groupId/movie/:movieId',
            lazy: () =>
              import('../pages/MovieDetailPage').then((m) => ({ Component: m.MovieDetailPage })),
          },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
