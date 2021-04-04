import React from 'react';
import styles from './Input.module.css';

const input = props => {
    let err = (!props.valid && props.touched) ? <span className={styles.errorText}>{props.msg}</span> : null;
    const inputClasses = [styles[props.shape]];
    if(!props.valid && props.touched) inputClasses.push(styles.error);
    return (
        <div className={styles.container}>
            <input className={inputClasses.join(" ")} {...props.attrs} onChange={props.change}></input> 
            {err}
        </div>
    );
};
export default input;