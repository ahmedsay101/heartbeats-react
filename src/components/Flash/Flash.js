import React, {useEffect, useState} from 'react';
import styles from './Flash.module.css';

function Flash(props) {

    const [shouldShow, setShow] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setShow(false);
            setTimeout(() => {props.destroy()}, 700); 
        }, 2000);
    }, []);
    

    return (
        <div className={`${styles.flash} ${shouldShow ? styles.appear : styles.disAppear}`}>
            <span className={styles.msg}>{props.msg}</span>
        </div>
    );

   
}

export default Flash;