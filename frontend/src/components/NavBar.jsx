import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import logo from '../logo.svg';

const pages = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];

export default function NavBar(){
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(false);
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  function handleLogout(){
    import('../api').then(m=>m.logout()).catch(()=>{}).finally(()=>{
      localStorage.removeItem('user');
      nav('/');
    });
  }

  return (
    <AppBar position="sticky" color="primary" elevation={3}>
      <Toolbar>
        <Box sx={{ display:'flex', alignItems:'center', cursor:'pointer' }} onClick={()=>nav('/') }>
          <img src={logo} alt="Farm2Mandi" style={{ height:36, marginRight:12 }} />
          
        </Box>

        <Box sx={{ flexGrow:1 }} />

        {isMobile ? (
          <>
            <IconButton edge="end" color="inherit" onClick={()=>setOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={open} onClose={()=>setOpen(false)}>
              <Box sx={{ width:260 }} role="presentation" onClick={()=>setOpen(false)}>
                <List>
                  {pages.map(p=> (
                    <ListItem key={p.to} disablePadding>
                      <ListItemButton component={RouterLink} to={p.to}>
                        <ListItemText primary={p.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {user && (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to={'/input'}>
                          <ListItemText primary={'Input'} />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to={'/profile'}>
                          <ListItemText primary={'Profile'} />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to={'/transport'}>
                          <ListItemText primary={'Transport'} />
                        </ListItemButton>
                      </ListItem>
                    </>
                  )}
                  {!user ? (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to={'/login'}>
                          <ListItemText primary={'Login'} />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to={'/register'}>
                          <ListItemText primary={'Register'} />
                        </ListItemButton>
                      </ListItem>
                    </>
                  ) : (
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleLogout}>
                        <ListItemText primary={'Logout'} />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display:'flex', gap:1, alignItems:'center' }}>
            {pages.map(p=> (
              <Button key={p.to} color="inherit" component={RouterLink} to={p.to}>{p.label}</Button>
            ))}
            {user && (
              <>
                <Button color="inherit" component={RouterLink} to={'/input'}>Input</Button>
                <Button color="inherit" component={RouterLink} to={'/transport'}>Transport</Button>
                <Button color="inherit" component={RouterLink} to={'/profile'}>Profile</Button>
              </>
            )}
            {user ? (
              <>
                <Typography sx={{ ml:2, mr:1 }}>{user.name}</Typography>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to={'/login'}>Login</Button>
                <Button color="secondary" variant="contained" component={RouterLink} to={'/register'} sx={{ ml:1 }}>Register</Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
