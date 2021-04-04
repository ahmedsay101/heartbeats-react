import React from 'react';
import styles from './SliderArtist.module.css';
import { useHistory } from "react-router-dom";

function SliderArtist(props) {
    const history = useHistory();
    const openPage = () => {
        history.push("/artist/"+props.data.id);
    }
    return (
        <div className={styles.artistContainer} style={{width: props.width}} onClick={openPage}>
            <div className={styles.artistImg} style={{backgroundImage: "url("+props.data.imgUrl+")"}}></div>
            <span className={styles.artistName}>{props.data.name}</span>
        </div>
    );
}

export default SliderArtist;