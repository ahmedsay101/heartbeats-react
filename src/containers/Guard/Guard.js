import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {isAuthenticated} from '../../commonActions';

const Guard = props => {
    const [loading, setLoading] = useState(true);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const history = useHistory();

    useEffect(() => {
        authenticate();
    }, []);

    const authenticate = async () => {
        const authenticated = await isAuthenticated();
        if(authenticated) {
            setUserLoggedIn(true);
            setLoading(false);
        }
        else {
            setUserLoggedIn(false);
            setLoading(false);
        }
    }

    let content;
    if(loading) {
        content = null;
    }
    else if(!loading && userLoggedIn) {
        content = props.children;
    }
    else {
        history.push('/');
        content = null;
    }

    return (content);
}

export default Guard;