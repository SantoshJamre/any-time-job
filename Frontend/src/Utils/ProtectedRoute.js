import React from 'react'
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"

const ProtectedHomeRoute = ({ children }) => {
    const user = useSelector((state) => state.user);
    let location = useLocation();
    if (!user?.state?.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children

};

const ProtectedOtpRoute = ({ children }) => {
    const verifyOtpData = useSelector((state) => state.otp);
    let location = useLocation();
    if (!verifyOtpData?.state?.isOtpVerified) {
        return <Navigate to="/" state={{ from: location }} replace />
    }
    return children
};

export { ProtectedHomeRoute, ProtectedOtpRoute };