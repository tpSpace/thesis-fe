import PropTypes from 'prop-types';
import {useEffect} from 'react';
import {useRouter} from 'next/router';
import useAuth from '../hooks/useAuth';
import {PATH_APP} from "../routes/paths";

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { push } = useRouter();

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      push(PATH_APP.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return <>{children}</>;
}
