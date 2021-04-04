import React, {useEffect} from 'react';
import styles from './Floating.module.css';

const Floating = props => {
    const close = e => {
        if(e.target.id === 'modal') {
            props.close(false);
        }
    }

    return (
        <div id='modal' className={styles.floating} onClick={close} style={{display: (props.open ? "flex" : "none")}}>
            {props.children}
        </div>
    );  
}
export default Floating;