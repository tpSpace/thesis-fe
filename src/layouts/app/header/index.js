import PropTypes from 'prop-types';
import {styled} from '@mui/material/styles';
import {AppBar, Box, Stack, Toolbar} from '@mui/material';
import cssStyles from '../../../utils/cssStyles';
import {HEADER, NAVBAR} from '../../../config';
import AccountPopover from './AccountPopover';

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
})(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur(),
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
    ...(verticalLayout && {
      width: '100%',
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      backgroundColor: theme.palette.background.default,
    }),
  },
}));

AppHeader.propTypes = {
  isCollapse: PropTypes.bool,
  verticalLayout: PropTypes.bool,
};

export default function AppHeader({ isCollapse = false, verticalLayout = false }) {
  return (
    <RootStyle isCollapse={isCollapse} verticalLayout={verticalLayout}>
      <Toolbar
        sx={{
          minHeight: '100% !important',
          px: { lg: 5 },
        }}
      >
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <AccountPopover />
        </Stack>
      </Toolbar>
    </RootStyle>
  );
}
