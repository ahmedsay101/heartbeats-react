import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './UserStatus.module.css';
import avatar from '../../assets/default-user.svg';
import Spinner from '../Spinner/Spinner';
import {authFailed, authStorageExist} from '../../commonActions';

function UserStatus(props) {

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const failed = () => {
        authFailed();
        setUserData(null);
        setLoading(false);
    }

    const authenticate = () => {
        if(authStorageExist()) {
            setLoading(true);
            axios({method: 'GET', url: `users/${localStorage.getItem('userId')}`}).then(res => {
                if(res.status === 200) {
                    setUserData(res.data.data);
                    setLoading(false);
                }
                else {
                    failed(); 
                }
            })
            .catch(err => failed());
        }
        else {
            failed();
        }
    }

    useEffect(() => {
        authenticate();
        window.addEventListener("userShouldUpdate", authenticate);
    }, []);

    let userStatus;
    if(loading) {
        userStatus = <Spinner shape="buttonSpinner"/>;
    }
    else if(!loading && userData !== null) {
        userStatus = <Link to="/profile" className="link"><div className={styles.justFlex}>
            <img src={userData.imgUrl} className={styles.userImg}/>
            <span className={styles.userText}>{userData.firstName +" "+ userData.lastName}</span>
        </div></Link>;
    }
    else if(!loading && userData === null) {  
        userStatus = <Link to="/auth" className="link"><div className={styles.justFlex}>
            <img src={avatar} className={styles.userImg}/>
            <span className={styles.userText}>Log in</span>
        </div></Link>;
    }
    return (
        <div className={styles.userSec}>{userStatus}</div>
    );
}

export default UserStatus;