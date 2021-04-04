import React from 'react';
import styles from './NotFound.module.css';
import warning from '../../assets/warning.svg';

function NotFound() {
    return (
        <div className={styles.container}>
            <img src={warning} className={styles.warning}/>
            <span className={styles.text}>Sorry, We Couldn't Find What You're Looking For</span>
        </div>
    );
}
export default NotFound;