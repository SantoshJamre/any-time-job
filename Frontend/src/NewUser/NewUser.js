import React, { useState } from 'react';
import {
    Grid,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
} from '@mui/material';
import { post } from '../Utils/utility';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setUser } from '../Redux/Slice/userSlice';
import { verifyOtp } from '../Redux/Slice/OtpSlice'

const Registration = () => {
    const [data, setData] = useState({
        email: '',
        countryCode: '+91',
        mobileNumber: '',
        password: '',
        confirmPassword: '',
        name: ''
    });
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [errors, setErrors] = useState({
        pwShort: '',
        pwMismatch: '',
        phoneShort: '',
        invalidEmail: '',
        invalidName: ''
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        console.log(":::value", value)
        setData({
            ...data,
            [e.target.name]: (e.target.name === 'mobileNumber' && value && !Number(value)) ? data.mobileNumber : value,
        });
        setErrors({
            pwShort: '',
            pwMismatch: '',
            phoneShort: '',
            invalidEmail: '',
            invalidName: ''
        })

    };

    function isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    const validateFields = () => {
        let error = false;

        if (data.password && data.password.length < 5) {
            error = true;
            setErrors({ ...errors, pwShort: 'Password must contain at least 5 characters' });
        }

        if (data.confirmPassword && data.confirmPassword !== data.password) {
            error = true;
            setErrors({ ...errors, pwMismatch: "Passwords don't match" });
        }


        if (data.mobileNumber && data.mobileNumber.length != 10) {
            error = true;
            setErrors({ ...errors, phoneShort: "Mobile number must be 10 digit number" });
        }

        if (data.email && !(isValidEmail(data.email))) {
            error = true;
            setErrors({ ...errors, invalidEmail: "Invalid Email" });
        }

        if (data.name) {
            if (data.name.length < 5) {
                error = true;
                setErrors({ ...errors, invalidName: "Name must contain at least 5 characters" });
            } else if (/^[0-9a-z]/ig.test(data.name)) {
                setErrors({ ...errors, invalidName: "Name should contain only alpha numeric value " });
            }
        }


        return error;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data);

        if (validateFields()) {
            return;
        }
        const result = await post('create-user', {
            email: data.email,
            countryCode: data.countryCode,
            phoneNumber: data.mobileNumber,
            password: data.password,
            name: data.name
        })

        if (result.uid) {
            dispatch(setUser(result))
            dispatch(verifyOtp(false))
            navigate("/");
        } else if (result.message && result.code) {
            setApiError(result.message);
        } else {
            setApiError('Something went wrong. Please try again.');
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid item xs={12} align="center">
                <h1>REGISTER</h1>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="countryCode-label">Country Code</InputLabel>
                                <Select
                                    labelId="countryCode-label"
                                    id="countryCode"
                                    name="countryCode"
                                    value={data.countryCode}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="+91">+91 (India)</MenuItem>
                                    <MenuItem value="+1">+1 (USA)</MenuItem>
                                    <MenuItem value="+44">+44 (UK)</MenuItem>
                                    <MenuItem value="+81">+81 (Japan)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                id="mobileNumber"
                                name="mobileNumber"
                                label="Mobile Number"
                                onChange={handleChange}
                                value={data.mobileNumber}
                                error={errors.phoneShort !== ''}
                                helperText={errors.phoneShort}
                                required
                                type="mobileNumber"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="User name"
                                onChange={handleChange}
                                value={data.name}
                                error={errors.invalidName !== ''}
                                helperText={errors.invalidName}
                                required
                                type="name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                onChange={handleChange}
                                value={data.email}
                                error={errors.invalidEmail !== ''}
                                helperText={errors.invalidEmail}
                                required
                                type="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                onChange={handleChange}
                                value={data.password}
                                error={errors.pwShort !== ''}
                                helperText={errors.pwShort}
                                required
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirm Password"
                                onChange={handleChange}
                                value={data.confirmPassword}
                                error={errors.pwMismatch !== ''}
                                helperText={errors.pwMismatch}
                                required
                                type="password"
                            />
                        </Grid>
                        {apiError && (
                            <Typography variant="body2" color="error" align="center">
                                {apiError}
                            </Typography>
                        )}
                        <Grid item xs={12} align="center">
                            <Button type="submit" variant="contained" color="primary">
                                Create User
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    );
};

export default Registration;
