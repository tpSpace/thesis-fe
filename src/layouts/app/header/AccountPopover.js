import {useSnackbar} from 'notistack';
import {useState} from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import {alpha} from '@mui/material/styles';
import {Box, Divider, MenuItem, Stack, Typography} from '@mui/material';
import {PATH_APP, PATH_AUTH} from '../../../routes/paths';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import MyAvatar from '../../../components/MyAvatar';
import MenuPopover from '../../../components/MenuPopover';
import {IconButtonAnimate} from '../../../components/animate';

const MENU_OPTIONS = [
    {
        label: 'Home',
        linkTo: '/',
    },
    {
        label: 'My Account',
        linkTo: PATH_APP.user.myAccount,
    },
];

export default function AccountPopover() {
    const router = useRouter();

    const {user, logout} = useAuth();

    const isMountedRef = useIsMountedRef();

    const {enqueueSnackbar} = useSnackbar();

    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.replace(PATH_AUTH.login);

            if (isMountedRef.current) {
                handleClose();
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Unable to logout!', {variant: 'error'});
        }
    };

    return (
        <>
            <IconButtonAnimate
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <MyAvatar/>
            </IconButtonAnimate>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                    p: 0,
                    mt: 1.5,
                    ml: 0.75,
                    '& .MuiMenuItem-root': {
                        typography: 'body2',
                        borderRadius: 0.75,
                    },
                }}
            >
                <Box sx={{my: 1.5, px: 2.5}}>
                    <Typography variant="subtitle2" noWrap>
                        {`${user.firstName} ${user.lastName}`}
                    </Typography>
                    <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                        {user?.email}
                    </Typography>
                </Box>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <Stack sx={{p: 1}}>
                    {MENU_OPTIONS.map((option) => (
                        <NextLink key={option.label} href={option.linkTo} passHref>
                            <MenuItem key={option.label} onClick={handleClose}>
                                {option.label}
                            </MenuItem>
                        </NextLink>
                    ))}
                </Stack>

                <Divider sx={{borderStyle: 'dashed'}}/>

                <MenuItem onClick={handleLogout} sx={{m: 1}}>
                    Logout
                </MenuItem>
            </MenuPopover>
        </>
    );
}
