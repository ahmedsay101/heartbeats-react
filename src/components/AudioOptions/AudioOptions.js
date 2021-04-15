import React from "react";
import styles from "./AudioOptions.module.css";
import Button from '../Button/Button';
import playlist from '../../assets/playlist.svg';
import like from '../../assets/like.svg';
import liked from '../../assets/liked.svg';
import volume from '../../assets/volume.svg';
import mute from '../../assets/mute.svg';
import highVolume from '../../assets/highVolume.svg';


function AudioOptions(props) {
    let volumeIcon;
    if(props.volume > 0.5) {
        volumeIcon = <img className={styles.optionIcon} src={highVolume}></img>;
    }
    else if(props.volume < 0.5 && props.volume > 0) {
        volumeIcon = <img className={styles.optionIcon} src={volume}></img>;
    }
    else if(props.mute || props.volume == 0) {
        volumeIcon = <img className={styles.optionIcon} src={mute}></img>;
    }
    return (
        <div className={styles.audioOptions}>
            <div className={styles.options}>
                <Button shape="audioOptions" click={props.onVolume} forwardedRef={props.volumeButtonRef}>
                    {volumeIcon}
                </Button>
                {( props.authenticated() ? <Button shape="audioOptions" click={props.onLike}>
                    <img className={styles.optionIcon} src={(props.isLiked ? liked : like)}/>
                </Button> : null )}
                <Button shape="audioOptions" click={props.onQueue} forwardedRef={props.queueButtonRef}>
                    <img className={styles.optionIcon} src={playlist}/>
                </Button>
            </div>
        </div>
    );
}


export default AudioOptions;

