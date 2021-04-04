import React, {useState, useEffect} from 'react';
import axios from 'axios';
import styles from "./UserHeader.module.css";
import Spinner from '../../components/Spinner/Spinner'

const UserHeader = props => {

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getData = () => {
        axios({method: 'GET', url: `users/${localStorage.getItem("userId")}`}).then(res => {
            setUserData(res.data.data);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log(err);
        });
    }

    useEffect(() => {
        getData();
        window.addEventListener("userShouldUpdate", getData);
    }, []);


    let content;
    if(loading) {
        content = <Spinner shape='buttonSpinner' />;
    }
    else {
        content = <div className={styles.userData}>
                    <div className={styles.img} style={{backgroundImage: "url("+userData.imgUrl}} />
                    <div className={styles.data}>
                        <span className={styles.userName}>{`${userData.firstName} ${userData.lastName}`}</span>
                        <span className={styles.sec}>{`Member since ${userData.joinDate}`}</span>
                    </div>
                </div>;
    }
    return (
        <div className={styles.header+" "+(loading ? styles.loading: "")}>
            {content}
        </div>
    );
}

export default UserHeader;