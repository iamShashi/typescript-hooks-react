import { matchPath, useLocation } from 'react-router';

import { routes } from '../routes';

const useCurrentRoute = (): NavItem => {
  const location = useLocation();

  const currentRoute = routes.find((route) => matchPath(location.pathname, route));

  if (!currentRoute) {
    return {
      key: 'dummy',
      path: '',
      exact: true,
      name: '',
      main: '',
    };
  }

  return currentRoute;
};

export default useCurrentRoute;
