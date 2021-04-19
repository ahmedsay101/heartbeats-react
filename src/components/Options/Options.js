import React, {useEffect, useRef} from 'react';
import styles from './Options.module.css';
import Floating from '../../containers/Floating/Floating';

const Options = props => {
    const container = useRef(null);

    useEffect(() => {

        window.addEventListener('scroll', () => { 
            if(window.innerWidth > 600) {
                props.destroy();
            }
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

    if(window.innerWidth >= 800) {
        return (
            <div className={styles.options} ref={container} style={{top: props.position.top + "px", left: props.position.left + "px"}}>
                {options}
            </div>
        );
    }
    else if (window.innerWidth < 800) {
        return (
            <Floating open={true} destroy={props.destroy}>
                <div className={styles.options} ref={container} style={{top: props.position.top + "px", left: props.position.left + "px"}}>
                    {options}
                </div>
            </Floating>
        );
    }
}

export default Options;