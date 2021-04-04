import React from 'react';
import styles from './SearchArtist.module.css';
import { Link } from 'react-router-dom';

function SearchArtist(props) {
    return (
        <div className={"result"+ " " +(props.searchResultsLength === 1 ? "noBorder" : "")}>
            <div className={styles.rightSec}>
                <img src={props.artistData.imgUrl} className={styles.searchImg}/>
                <Link to={`/artist/${props.artistData.id}`}><span className={styles.smallTxt}>{props.artistData.name}</span></Link>
            </div>
            <div className={"link "+styles.artist}><span className={styles.miniTxt}>Artist</span></div>  
        </div>
    );
}

export default SearchArtist;



