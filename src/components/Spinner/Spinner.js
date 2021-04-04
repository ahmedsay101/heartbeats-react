import React from 'react';
import styles from './Spinner.module.css';

const spinner = props => (
    <div className={styles[props.shape]}></div>
);
export default spinner;