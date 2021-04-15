import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './Options.module.css';
import avatar from '../../assets/default-user.svg';
import Spinner from '../Spinner/Spinner';
import {authFailed, authStorageExist} from '../../commonActions';

const Options = props => {
    const container = useRef(null);

    useEffect(() => {

        window.addEventListener('scroll', () => { 
            props.destroy();
        });
        document.addEventListener('click', e => {
            if(container && container.current) {
                if(!container.current.contains(e.target)) {
                    props.destroy();
                }
            }
        });
    }, []);

    const clickHandler = todo => {
        todo();
        props.destroy();
    }

    let options = null;
    if(props.options) {
        options = props.options.map(option => {
            return (  
                <button key={option.text} className={styles.option} onClick={() => clickHandler(option.todo)}>{option.text}</button> 
            );
        });
    }

    return (
        <div className={styles.options} ref={container} style={{top: props.position.top + "px", left: props.position.left + "px"}}>
            {options}
        </div>
    );
}

export default Options;