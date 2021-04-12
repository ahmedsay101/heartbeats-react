import React from 'react';
import styles from './Confirmation.module.css';

function Confirmation(props) {

    return (
        <div className={styles.confirmation}>
            <div className={styles.msgContainer}>
                <span className={styles.msg}>{props.msg}</span>
            </div>
            <div className={styles.options}>
                <button className={styles.confirm} onClick={props.confirm}>Confirm</button>
                <button className={styles.cancel} onClick={props.destroy}>Cancel</button>
            </div>
        </div>
    );
 
}

export default Confirmation;