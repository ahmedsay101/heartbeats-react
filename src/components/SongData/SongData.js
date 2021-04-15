import React from "react";
import styles from "./SongData.module.css";
import {Link} from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

import upload from '../../assets/upload.svg';

function SongData(props) {
    let artist, img;
    if(props.uploads) {
        artist = <Link className={styles.AudioPlayerArtistName} to='/uploads'>From Uploads</Link>;
        img = <div className='songImg'><img src={upload} className='upIc'/></div>;
    }
    else {
        img = <div className={styles.imgHolder} style={{backgroundImage: "url("+props.currentSong.imgUrl+")"}}></div>;
        artist = <Link to={`/artist/${props.currentSong.artistId}`}>
                    <span className={styles.AudioPlayerArtistName}>{props.currentSong.artistName}</span>
                </Link>
    }
    return (
        <React.Fragment>
            {(props.loading ? <div className={styles.songData+" "+styles.centerFlex}><Spinner shape="buttonSpinner" /></div> :
                <div className={styles.songData+" "+styles.flexStart}>
                    {img}
                    <div className={styles.flexColumn}>
                        <span className={styles.AudioPlayerSongName}>{props.currentSong.name}</span>
                        {artist}
                    </div>
                </div>
            )}  
        </React.Fragment>  
    );
}

export default SongData;

