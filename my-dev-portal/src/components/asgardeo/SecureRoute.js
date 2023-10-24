import React, { useEffect, useState } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";
import AsgardeoError from './AsgardeoError'; // Make sure to create a similar error component

const SecureRoute = ({ children, errorComponent }) => {
    const { state, signIn } = useAuthContext();
    const [handleLoginError, setHandleLoginError] = useState(null);
    const ErrorReporter = errorComponent || AsgardeoError;

    useEffect(() => {
        const handleLogin = async () => {
            try {
                await signIn();
            } catch (err) {
                setHandleLoginError(err);
            }
        };

        if (!state.isAuthenticated && !state.isLoading) {
            handleLogin();
        }
    }, [state, signIn]);

    if (handleLoginError) {
        return <ErrorReporter error={handleLoginError} />;
    }

    if (!state.isAuthenticated) {
        return null;
    }

    return children;
};

export default SecureRoute;
