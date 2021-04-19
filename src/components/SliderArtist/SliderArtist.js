import React, {useEffect, useState} from 'react';
import styles from './SliderArtist.module.css';
import { useHistory } from "react-router-dom";

function SliderArtist(props) {
    const history = useHistory();
    const [windowSize, setWindowSize] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', () => {
            setWindowSize(window.innerWidth);
        });

    }, []);

    let mousePosition;
    const clicked = e => {
        mousePosition = e.clientX;
    }

    const openPage = (e, url) => {
        if(mousePosition !== e.clientX) return;
        history.push(url);
    }
    return (
        <div className={styles.artistContainer} style={{width: props.width}} 
        onMouseDown={clicked} 
        onTouchStart={clicked} 
        onMouseUp={(e, url) => openPage(e, `/artist/${props.data.id}`)}
        onTouchEnd={(e, url) => openPage(e, `/artist/${props.data.id}`)}
        >
            <div className={styles.artistImg} style={{backgroundImage: "url("+props.data.imgUrl+")"}}></div>
            <span className={styles.artistName}>{props.data.name}</span>
        </div>
    );
}

export default SliderArtist;