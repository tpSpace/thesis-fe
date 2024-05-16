import PropTypes from 'prop-types';
import AuthGuard from '../guards/AuthGuard';
import LogoOnlyLayout from './LogoOnlyLayout';
import AppLayout from "./app";

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['dashboard', 'main', 'logoOnly']),
};

export default function Layout({ variant = 'dashboard', children }) {
  if (variant === 'logoOnly') {
    return <LogoOnlyLayout> {children} </LogoOnlyLayout>;
  }

  return (
    <AuthGuard>
      <AppLayout> {children} </AppLayout>
    </AuthGuard>
  );
}
