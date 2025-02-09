import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../../../shared-theme/ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { firebaseConfig } from '@/app/lib/firebase/config';
import {
	signInWithGoogle,
	signOut,
	onAuthStateChanged
} from "@/app/lib/firebase/auth";
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

function useUserSession(initialUser: User) {
	// The initialUser comes from the server via a server component
	const [user, setUser] = useState(initialUser);
	const router = useRouter();

	// Register the service worker that sends auth state back to server
	// The service worker is built with npm run build-service-worker
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			const serializedFirebaseConfig = encodeURIComponent(JSON.stringify(firebaseConfig));
			const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`
		
		  navigator.serviceWorker
			.register(serviceWorkerUrl)
			.then((registration) => console.log("scope is: ", registration.scope));
		}
	  }, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged((authUser: User) => {
			setUser(authUser)
		})

		return () => unsubscribe()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		onAuthStateChanged((authUser: User) => {
			if (user === undefined) return

			// refresh when user changed to ease testing
			if (user?.email !== authUser?.email) {
        router.refresh()
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return user;
}

export default function AppAppBar(initialUser: User) {
  const [open, setOpen] = React.useState(false);


  const user = useUserSession(initialUser) ;

    const handleSignOut = event => {
      event.preventDefault();
      signOut();
    };

    const handleSignIn = event => {
      console.log("clicked");
      event.preventDefault();
      signInWithGoogle();
    };


  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Link href="#">
              <Sitemark />
            </Link>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Link href="/#features">
                <Button variant="text" color="info" size="small">
                  Features
                </Button>
              </Link>
              <Link href="/#pricing">
                <Button variant="text" color="info" size="small">
                  Pricing
                </Button>
              </Link>
              <Link href="/#faq">
                <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                  FAQ
                </Button>
              </Link>

                {user && (
                <Link href="/design">
                 <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                    Design
                  </Button>
                </Link>
                )}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {user ? (
              <>
                <Avatar alt={user.displayName || 'User'} src={user.photoURL || ''} />
                <Button color="primary" variant="contained" size="small" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button color="primary" variant="text" size="small" onClick={handleSignIn}>
                  Sign in
                </Button>
                <Button color="primary" variant="contained" size="small" onClick={handleSignIn}>
                  Sign up
                </Button>
              </>
            )}
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem>Features</MenuItem>
                {/* <MenuItem>Testimonials</MenuItem>
                <MenuItem>Highlights</MenuItem> */}
                <MenuItem>Pricing</MenuItem>
                <MenuItem>FAQ</MenuItem>
                {user && (
                <Link href="/design">
                 <MenuItem>
                    Design
                  </MenuItem>
                </Link>
                )}
                {/* <MenuItem>Blog</MenuItem> */}
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  {user ? (
                    <>
                      <Avatar alt={user.displayName || 'User'} src={user.photoURL || ''} />
                      <Button color="primary" variant="contained" onClick={handleSignOut}>
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button color="primary" variant="text" onClick={handleSignIn}>
                        Sign in
                      </Button>
                      <Button color="primary" variant="contained" onClick={handleSignIn}>
                        Sign up
                      </Button>
                    </>
                  )}
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
