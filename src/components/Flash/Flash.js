import React, {useEffect, useState, useRef} from 'react';
import { connect} from 'react-redux';
import styles from './Flash.module.css';

import like from '../../assets/like.svg';

function Flash(props) {

    const [shouldShow, setShow] = useState(true);
    const [msg, setMsg] = useState(null);


    useEffect(() => {
        setTimeout(() => {
            setShow(false);
            props.setMsg(null); 
        }, 2000);
    }, []);
    

    return (
        <div className={`${styles.flash} ${shouldShow ? styles.appear : styles.disAppear}`}>
            <span className={styles.msg}>{props.msg}</span>
        </div>
    );

   
}

export default Flash;