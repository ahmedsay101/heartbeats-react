import React from 'react';
import styles from './Button.module.css';
import Spinner from '../Spinner/Spinner';


const button = props => {
    let content = (props.loading) ? <Spinner shape={props.spinner}/> : props.children;
    const classes = [styles[props.shape]];
    classes.push(props.otherClasses);
    return (
        <button id={props.id} className={classes.join(" ")} onClick={props.click} ref={props.forwardedRef} style={props.customStyle}>
            {content}
        </button>
    );
};
export default button;