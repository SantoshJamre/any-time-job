import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';

import { post } from '../Utils/utility'
import { useDispatch } from 'react-redux';
import { verifyOtp } from '../Redux/Slice/OtpSlice';


const defaultTheme = createTheme();

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [isEmailSet, setIsEmail] = useState(false);
    const [error, setError] = useState(null);
    const [otp, setOtp] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (!(email)) {
            setError('Please enter email.');
            return;
        }
        const userData = await post('sign-up', { email })
        if (userData.message === 'Do Register with your otp') {
            const element = document.getElementById('email');
            if (element) { element.disabled = true; }
            setError(null);
            setIsEmail(true)
        } else if (userData.message && userData.code) {
            setError(userData.message);
        } else {
            setError('Invalid email Please try again.');
        }
    };

    const handleVerifyOtp = async (event) => {
        event.preventDefault();
        if (!(otp)) {
            setError('Please enter otp.');
            return;
        }
        const otpData = await post('verify-otp', { email, otp: parseInt(otp) })
        if (otpData.message === 'otp verified') {
            setError('');
            dispatch(verifyOtp(true))
            navigate('/create-user')
        } else if (otpData.message && otpData.code) {
            setError(otpData.message);
        } else {
            setError('Invalid otp, Please try again.');
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(null) }}
                        />
                        {isEmailSet && <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="otp"
                            label="Enter OTP"
                            name="otp"
                            autoComplete="otp"
                            autoFocus
                            value={otp}
                            onChange={(e) => { setOtp(e.target.value); setError(null) }}
                        />}
                        {error && ( // Display error message if error exists
                            <Typography variant="body2" color="error" align="center">
                                {error}
                            </Typography>
                        )}
                        {isEmailSet &&
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleVerifyOtp}
                            >
                                verify otp
                            </Button> || <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSignUp}
                            >
                                Sign Up
                            </Button>
                        }
                        <Grid container>
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {" Already having account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
