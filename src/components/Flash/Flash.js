import React, {useEffect, useState} from 'react';
import styles from './Flash.module.css';

function Flash(props) {

    const [shouldShow, setShow] = useState(true);

    useEffect(() => {
        let mounted = true;
        setTimeout(() => {
            if(mounted) setShow(false);
        }, 2000);
        return () => {
            mounted = false;
        }
    }, []);
    

    return (
        <div className={`${styles.flash} ${shouldShow ? styles.appear : styles.disAppear}`}>
            <span className={styles.msg}>{props.msg}</span>
        </div>
    );

   
}

export default Flash;