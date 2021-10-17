import React from 'react';
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));
const UserManagerment = React.lazy(() => import('./views/pages/userManagerment'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/users', exact: true, name: 'Users', component: Users },
  { path: '/quan-ly-user', exact: true, name: 'User Managerment', component: UserManagerment },
  { path: '/users/:id', exact: true, name: 'User Details', component: User }
];

export default routes;
