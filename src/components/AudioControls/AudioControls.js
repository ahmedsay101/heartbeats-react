import React from "react";
import styles from "./AudioControls.module.css";
import Button from '../Button/Button';
import repeat from '../../assets/repeat.svg';
import repeated from '../../assets/repeated.svg';
import shuffle from '../../assets/shuffle.svg';
import shuffled from '../../assets/shuffled.svg';
import next from '../../assets/next.svg';
import previous from '../../assets/previous.svg';
import play from '../../assets/play.svg';
import pause from '../../assets/pause.svg';

function AudioControls(props) {
    return (
        <div className={styles.audioControls}>
            <Button shape="repeat" click={props.onRepeat}>
                {(props.repeat ? <img src={repeated} className={styles.shuffleRepeatIcon} /> :
                    <img src={repeat} className={styles.shuffleRepeatIcon} /> )}
            </Button>

            <Button shape="next-prev" click={props.previous}>
                <img src={previous} className={styles.nextPrevIcon} />
            </Button>

            {( window.innerWidth >= 800 ? <Button shape="play" click={props.onPlay} spinner="buttonSpinner" loading={props.loading}>
                {(props.play ? <img src={pause} className={styles.playPauseIcon} /> :
                    <img src={play} className={styles.playPauseIcon} /> )}
            </Button> : null )}

            <Button shape="next-prev" click={props.next}>
                <img src={next} className={styles.nextPrevIcon} />
            </Button>

            <Button shape="shuffle" click={props.onShuffle}>
                {(props.shuffle ? <img src={shuffled} className={styles.shuffleRepeatIcon} /> :
                    <img src={shuffle} className={styles.shuffleRepeatIcon} /> )}
            </Button>
        </div>
    );
}

export default AudioControls;
