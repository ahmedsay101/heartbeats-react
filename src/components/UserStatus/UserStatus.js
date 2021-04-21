import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import styles from './UserStatus.module.css';
import avatar from '../../assets/default-user.svg';
import arrowDown from '../../assets/arrowDown.svg';
import Spinner from '../Spinner/Spinner';
import {authFailed, authStorageExist, calculateOptionsPosition, logout} from '../../commonActions';
import Options from '../Options/Options';

const UserStatus = props => {
    const history = useHistory();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showOptions, setShowOptions] = useState(false);
    const [optionsPosition, setOptionsPosition] = useState(null);
    const optionsBtn = useRef(null);

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
        let mounted = true;
        if(mounted) authenticate();
        window.addEventListener("userShouldUpdate", authenticate);
        return () => {
            window.removeEventListener("userShouldUpdate", authenticate);
        }
    }, []);

    const userOptions = [{
        text: 'Your profile', 
        todo: () => history.push('/profile')
    },
    {
        text: 'Edit your information', 
        todo: () => history.push('/profile/edit')
    },
    {
        text: 'Your playlists', 
        todo: () => history.push('/playlists')
    },
    {
        text: 'Your likes', 
        todo: () => history.push('/likes')
    },
    {
        text: 'Your uploads', 
        todo: () => history.push('/uploads')
    },
    {
        text: 'Logout', 
        todo: logout
    }];

    const optionsClickHandler = () => {
        setOptionsPosition(calculateOptionsPosition(optionsBtn.current, userOptions.length, true));
        setShowOptions(!showOptions);
    }

    let userStatus;
    if(loading) {
        userStatus = <Spinner shape="buttonSpinner"/>;
    }
    else if(!loading && userData !== null) {
        userStatus = <React.Fragment>
            {(showOptions ? <Options position={optionsPosition} options={userOptions} destroy={() => setShowOptions(false)} /> : null)}
        <div className={styles.justFlex}>
            <Link to="/profile" className={`${styles.justFlex} link`}>
            <img src={userData.imgUrl} className={styles.userImg}/>
            <span className={styles.userText}>{window.innerWidth >= 600 ? userData.firstName+" "+ userData.lastName : userData.firstName.charAt(0)+""+userData.lastName.charAt(0)}</span>
            </Link>
            <button className={styles.imgHolder} ref={optionsBtn} onClick={optionsClickHandler}><img src={arrowDown} className={styles.arrow} /></button>
        </div>
        </React.Fragment>;
    }
    else if(!loading && userData === null) {  
        userStatus = <Link className="link" to={{ 
            pathname: '/auth', 
            state: { comingFrom: window.location.pathname } 
          }}><div className={styles.justFlex}>
            <img src={avatar} className={styles.userImg}/>
            <span className={styles.userText}>Log in</span>
        </div></Link>;
    }
    return (
        <div className={styles.userSec}>{userStatus}</div>
    );
}

export default UserStatus;