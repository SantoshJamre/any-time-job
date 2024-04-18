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
import { put } from '../Utils/utility';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { setUser } from '../Redux/Slice/userSlice';
import ToastMessage from '../Utils/toastMessage'

const UpdateProfile = () => {
    const [data, setData] = useState({
        email: '',
        countryCode: '',
        mobileNumber: '',
        name: ''
    });
    const [apiError, setApiError] = useState(null);
    // const navigate = useNavigate();
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user);
    const payload = user?.user?.payload || {};

    const [errors, setErrors] = useState({
        phoneShort: '',
        invalidEmail: '',
        invalidName: ''
    });
    const [toastMsg, settoastMsg] = useState({
        open: false,
        severity: "",
        message: ""
    });

    const handleCloseToast = () => {
        settoastMsg({ ...toastMsg, open: false })
    }

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setData({
            ...data,
            [e.target.name]: (e.target.name === 'mobileNumber' && value && !Number(value)) ? data.mobileNumber : value,
        });
        setErrors({
            phoneShort: '',
            invalidEmail: '',
            invalidName: '',
        })
        setApiError('')

    };

    function isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    const validateFields = () => {
        let error = false;

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
            }
            // else if (/^[0-9a-z]/ig.test(data.name)) {
            //     setErrors({ ...errors, invalidName: "Name should contain only alpha numeric value " });
            // }
        }


        return error;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data);

        if (validateFields()) {
            return;
        }
        const headers = {
            accessToken: payload?.authToken?.accessToken || '',
            refreshToken: payload?.authToken?.refreshToken || '',
        }

        const APIPayload = JSON.parse(JSON.stringify(
            {
                email: data.email || undefined,
                countryCode: data.countryCode || undefined,
                phoneNumber: data.mobileNumber || undefined,
                name: data.name || undefined
            }
        ))
        if (!Object.keys(APIPayload).length) {
            setApiError("No fields to update")
            return;
        }
        const result = await put(`update-user/${payload.uid}`, headers, APIPayload)

        if (result.uid) {
            dispatch(setUser(result))
            settoastMsg({ open: true, severity: 'success', message: 'Profile has been updated.' })
        } else if (result.message && result.code) {
            setApiError(result.message);
        } else {
            setApiError('Something went wrong. Please try again.');
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid item xs={12} align="center">
                <h1>PROFILE UPDATE</h1>
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
                                type="email"
                            />
                        </Grid>
                        {apiError && (
                            <Typography variant="body2" color="error" align="center">
                                {apiError}
                            </Typography>
                        )}
                        <Grid item xs={12} align="center">
                            <Button type="submit" variant="contained" color="primary">
                                Update Profile
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
            <Grid>
                <ToastMessage
                    open={toastMsg.open}
                    onClose={handleCloseToast}
                    severity={toastMsg.severity}
                    message={toastMsg.message} />
            </Grid>
        </Grid>
    );
};

export default UpdateProfile;
