import React, { useState } from 'react';
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
import MensLeaderboard from './components/MensLeaderboard';
import WomensLeaderboard from './components/WomensLeaderboard';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#ff6f00',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
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
  },
  {
    text: "Men's Leaderboard",
    icon: <EmojiEvents />,
    component: MensLeaderboard,
    path: 'mens-leaderboard'
  },
  {
    text: "Women's Leaderboard",
    icon: <EmojiEvents />,
    component: WomensLeaderboard,
    path: 'womens-leaderboard'
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('mens-players');
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePageChange = (path) => {
    setCurrentPage(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getCurrentComponent = () => {
    const menuItem = menuItems.find(item => item.path === currentPage);
    return menuItem ? menuItem.component : MensPlayers;
  };

  const drawer = (
    <Box>
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
          color: 'white',
          textAlign: 'center',
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <SportsTennis sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Tennis League
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
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
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
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
  );

  const CurrentComponent = getCurrentComponent();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            backgroundColor: 'white',
            color: 'primary.main',
            boxShadow: 1,
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
            backgroundColor: '#f5f5f5',
          }}
        >
          <Toolbar /> {/* Spacer for fixed app bar */}
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <CurrentComponent />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
