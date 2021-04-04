import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import {isAuthenticated} from '../../commonActions';

const AuthGuard = props => {
    const [userLoggedIn, setUserLoggedIn] = useState(null);
    const history = useHistory();

    useEffect(() => {
        authenticate();
    }, []);

    const authenticate = async () => {
        const authenticated = await isAuthenticated();
        if(authenticated) {
            history.push('/');
            setUserLoggedIn(true);
        }
        else {
            setUserLoggedIn(false);
        }
    }

    let content;
    if(userLoggedIn) {
        content = null;
    }
    else if(!userLoggedIn) {
        content = props.children;
    }
    return (content);
}

export default AuthGuard;