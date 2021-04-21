import React, {useEffect, useState} from 'react';
import styles from './SliderSong.module.css';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import play from "../../assets/play.svg";
import pause from "../../assets/pause.svg";
import { setNewSong } from '../../store/actions';
import Button from '../Button/Button';

const SliderSong = props => {
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
    const playSong = e => {
        if(mousePosition !== e.clientX) return;
        if(props.currentSong.id == props.data.id && !props.playingFromUploads) {
            props.setPlay(!props.play);
        }
        else {
            props.setTrack({
                id: props.data.id,
                playlist: props.playlist,
                play: true,
                uploads: false
            });
        }
    }

    if(windowSize > 600) {
        return (
            <div className={styles.container} style={{"width": props.width}}>
                <div className={styles.SliderSong} style={{
                    "backgroundImage": `url(${props.data.imgUrl})`,
                    "MozBoxShadow": "inset 0 -70px 90px 10px"+props.data.imgColor,
                    "WebkitBoxShadow": "inset 0 -70px 90px 10px"+props.data.imgColor,
                    "boxShadow": "inset 0 -70px 90px 10px"+props.data.imgColor
                }}>
                    <div className={styles.SliderSongModal} onMouseDown={clicked} onMouseUp={playSong}>
                        <Button shape="play">
                            {(props.currentSong.id == props.data.id && props.play ? <img src={pause} className={styles.playIcon}></img> : <img src={play} className={styles.playIcon}></img>)}
                        </Button>
                    </div>
                    <div className={styles.songData}>
                        <span className={styles.songName}>
                            {props.data.name}
                        </span>
                        <span className={styles.artistName}>
                            {props.data.artistName}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    else if (windowSize <= 600) {
        return (
            <div className={styles.container} style={{"width": props.width}}>
                <div className={styles.mobContainer}>
                    <div className={styles.mobImg} style={{backgroundImage: `url(${props.data.imgUrl})`}}/>
                    <div className={styles.songData}>
                        <div className={styles.mobName} onMouseDown={clicked} onMouseUp={playSong} onTouchStart={clicked} onTouchEnd={playSong}>
                            <span className={styles.songName}>
                                {props.data.name}
                            </span>
                            {(props.currentSong.id == props.data.id && props.play ? <img src={pause} className={styles.playIcon}></img> : <img src={play} className={styles.playIcon}></img>)}
                        </div>
                        <Link to={`/artist/${props.data.artistId}`} className={styles.artistName}>
                            {props.data.artistName}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        play: state.audioPlaying,
        currentSong: state.currentSong,
        playingFromUploads: state.playingFromUploads,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setPlay: (play) => dispatch({type: "SET_PLAYING", play: play}),
        setTrack: (data) => dispatch(setNewSong(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SliderSong);