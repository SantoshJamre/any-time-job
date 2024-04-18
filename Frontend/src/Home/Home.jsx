import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { removeUser } from '../Redux/Slice/userSlice'
import { AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router';

const HomePage = () => {
  const user = useSelector((state) => state.user);
  const userName = user?.user?.payload?.name.toUpperCase() || "";
  const image = user?.user?.payload?.image || "../../public/user.png"
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    navigate('/update-user')
  };

  const handleLogout = () =>{
    dispatch(removeUser())
  }

  return (
    <div>
      <AppBar position="absolute">
        <Toolbar>
          <Typography style={{ flexGrow: 1 }} variant="h6">{userName}</Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Avatar alt="User Profile" src={image} onClick={handleMenuOpen} />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Edit Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default HomePage;
