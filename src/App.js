import React, { useState, useMemo, useCallback, Suspense } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  IconButton,
  useMediaQuery,
  CircularProgress,
  Fade,
  Alert,
} from '@mui/material';
import {
  SportsTennis,
  Person,
  EmojiEvents,
  Schedule,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Import page components
import MensPlayers from './components/MensPlayers';
import WomensPlayers from './components/WomensPlayers';
import MensMatches from './components/MensMatches';
import WomensMatches from './components/WomensMatches';
import LoadingSpinner from './components/LoadingSpinner';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

const ErrorFallback = ({ error }) => (
  <Box sx={{ p: 3, textAlign: 'center' }}>
    <Alert severity="error" sx={{ mb: 2 }}>
      Something went wrong loading this page
    </Alert>
    <Typography variant="body2" color="text.secondary">
      Error: {error?.message || 'Unknown error'}
    </Typography>
  </Box>
);

// Simple Fallback Component
const FallbackComponent = () => (
  <Box sx={{ p: 3, textAlign: 'center' }}>
    <Typography variant="h5" sx={{ mb: 2 }}>
      Welcome to Tennis League
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Select a page from the menu to get started.
    </Typography>
  </Box>
);

// Create theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#32CD32', // Lime green from the image
      light: '#7CFC00',
      dark: '#228B22',
    },
    secondary: {
      main: '#8A2BE2', // Purple from the image
      light: '#9370DB',
      dark: '#4B0082',
    },
    background: {
      default: '#0F0F0F', // Very dark background
      paper: '#1A1A1A', // Slightly lighter dark
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
    grey: {
      50: '#1A1A1A',
      100: '#2A2A2A',
      200: '#3A3A3A',
      300: '#4A4A4A',
      400: '#5A5A5A',
      500: '#6A6A6A',
      600: '#7A7A7A',
      700: '#8A8A8A',
      800: '#9A9A9A',
      900: '#AAAAAA',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.3)',
    '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.3)',
    '0px 4px 6px rgba(0, 0, 0, 0.4), 0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 10px 15px rgba(0, 0, 0, 0.4), 0px 4px 6px rgba(0, 0, 0, 0.3)',
    '0px 20px 25px rgba(0, 0, 0, 0.4), 0px 10px 10px rgba(0, 0, 0, 0.3)',
    '0px 25px 50px rgba(0, 0, 0, 0.4), 0px 12px 24px rgba(0, 0, 0, 0.3)',
    '0px 30px 60px rgba(0, 0, 0, 0.4), 0px 15px 30px rgba(0, 0, 0, 0.3)',
    '0px 35px 70px rgba(0, 0, 0, 0.4), 0px 18px 36px rgba(0, 0, 0, 0.3)',
    '0px 40px 80px rgba(0, 0, 0, 0.4), 0px 20px 40px rgba(0, 0, 0, 0.3)',
    '0px 45px 90px rgba(0, 0, 0, 0.4), 0px 22px 44px rgba(0, 0, 0, 0.3)',
    '0px 50px 100px rgba(0, 0, 0, 0.4), 0px 25px 50px rgba(0, 0, 0, 0.3)',
    '0px 55px 110px rgba(0, 0, 0, 0.4), 0px 27px 55px rgba(0, 0, 0, 0.3)',
    '0px 60px 120px rgba(0, 0, 0, 0.4), 0px 30px 60px rgba(0, 0, 0, 0.3)',
    '0px 65px 130px rgba(0, 0, 0, 0.4), 0px 32px 65px rgba(0, 0, 0, 0.3)',
    '0px 70px 140px rgba(0, 0, 0, 0.4), 0px 35px 70px rgba(0, 0, 0, 0.3)',
    '0px 75px 150px rgba(0, 0, 0, 0.4), 0px 37px 75px rgba(0, 0, 0, 0.3)',
    '0px 80px 160px rgba(0, 0, 0, 0.4), 0px 40px 80px rgba(0, 0, 0, 0.3)',
    '0px 85px 170px rgba(0, 0, 0, 0.4), 0px 42px 85px rgba(0, 0, 0, 0.3)',
    '0px 90px 180px rgba(0, 0, 0, 0.4), 0px 45px 90px rgba(0, 0, 0, 0.3)',
    '0px 95px 190px rgba(0, 0, 0, 0.4), 0px 47px 95px rgba(0, 0, 0, 0.3)',
    '0px 100px 200px rgba(0, 0, 0, 0.4), 0px 50px 100px rgba(0, 0, 0, 0.3)',
    '0px 105px 210px rgba(0, 0, 0, 0.4), 0px 52px 105px rgba(0, 0, 0, 0.3)',
    '0px 110px 220px rgba(0, 0, 0, 0.4), 0px 55px 110px rgba(0, 0, 0, 0.3)',
    '0px 115px 230px rgba(0, 0, 0, 0.4), 0px 57px 115px rgba(0, 0, 0, 0.3)',
    '0px 120px 240px rgba(0, 0, 0, 0.4), 0px 60px 120px rgba(0, 0, 0, 0.3)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.3)',
          border: '1px solid #2A2A2A',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});

const drawerWidth = 280;

const menuItems = [
  {
    text: "Men's Players",
    icon: <Person />,
    component: MensPlayers,
    path: 'mens-players'
  },
  {
    text: "Women's Players", 
    icon: <Person />,
    component: WomensPlayers,
    path: 'womens-players'
  },
  {
    text: "Men's Matches",
    icon: <Schedule />,
    component: MensMatches,
    path: 'mens-matches'
  },
  {
    text: "Women's Matches",
    icon: <Schedule />,
    component: WomensMatches,
    path: 'womens-matches'
  }
];

// Loading component for page transitions
const PageLoader = () => <LoadingSpinner message="Loading page..." />;

function App() {
  const [currentPage, setCurrentPage] = useState('mens-players');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Debug logging
  React.useEffect(() => {
    console.log('App component mounted');
    console.log('Available menu items:', menuItems.map(item => ({ path: item.path, component: item.component?.name })));
  }, []);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [mobileOpen]);

  const handlePageChange = useCallback((path) => {
    if (path === currentPage) return; // Prevent unnecessary re-renders
    
    setIsPageTransitioning(true);
    setCurrentPage(path);
    
    if (isMobile) {
      setMobileOpen(false);
    }
    
    // Add a small delay to show the transition
    setTimeout(() => {
      setIsPageTransitioning(false);
    }, 100);
  }, [currentPage, isMobile]);

  const getCurrentComponent = useMemo(() => {
    try {
      console.log('Loading component for page:', currentPage);
      const menuItem = menuItems.find(item => item.path === currentPage);
      if (menuItem && menuItem.component) {
        console.log('Found component:', menuItem.component.name);
        return menuItem.component;
      } else {
        console.log('No component found, using fallback');
        return FallbackComponent;
      }
    } catch (error) {
      console.error('Error loading component:', error);
      return FallbackComponent;
    }
  }, [currentPage]);

  const drawer = useMemo(() => (
    <Box>
      <Box
        sx={{
          p: 4,
          background: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          textAlign: 'center',
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <SportsTennis sx={{ fontSize: 24, color: 'white' }} />
        </Box>
                 <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
           Expert Tennis Academy
         </Typography>
         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
           Management System
         </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handlePageChange(item.path)}
              selected={currentPage === item.path}
              sx={{
                mx: 1,
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'grey.100',
                  color: 'text.primary',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentPage === item.path ? 'white' : 'inherit',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: currentPage === item.path ? 'bold' : 'normal',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  ), [currentPage, handlePageChange]);

  const CurrentComponent = getCurrentComponent;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* App Bar */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            backgroundColor: 'background.paper',
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
              {menuItems.find(item => item.path === currentPage)?.text || 'Tennis League'}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                border: 'none',
                boxShadow: 3,
              },
            }}
          >
            {drawer}
          </Drawer>
          
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                border: 'none',
                boxShadow: 3,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            backgroundColor: 'background.default',
          }}
        >
          <Toolbar /> {/* Spacer for fixed app bar */}
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Fade in={!isPageTransitioning} timeout={200}>
              <Box>
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <CurrentComponent />
                  </ErrorBoundary>
                </Suspense>
              </Box>
            </Fade>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default React.memo(App);
