import {React, useState} from 'react';
import styles from './SliderAlbum.module.css';
import { connect } from 'react-redux';

import { useHistory } from "react-router-dom";


import play from "../../assets/play.svg";
import pause from "../../assets/pause.svg";

import { setNewSong } from '../../store/actions';

function SliderAlbum(props) {
    let mousePosition;
    const clicked = e => {
        mousePosition = e.clientX;
    }
    const playSong = e => {
        if(mousePosition !== e.clientX) return;
        if(!props.data.songIds.includes(props.currentSong.id)) {
            props.setTrack(props.data.songIds[0], props.data.songIds, true);
        }
        else {
            props.setPlay(!props.play);
        }
    }

    const history = useHistory();
    const openPage = (e, url) => {
        if(mousePosition !== e.clientX) return;
        history.push(url);
    }

    return (
        <div className={styles.container} style={{"width": props.width}}>
            <div className={styles.inside}>
                <div className={styles.albumImg}>
                    <div className={styles.imgHolder} style={{backgroundImage: "url("+props.data.imgUrl+")"}}></div>
                    <div className={styles.modal} onMouseDown={clicked} onMouseUp={playSong}>
                        {(props.play && props.data.songIds.includes(props.currentSong.id) ? <img src={pause} className={styles.play} /> : <img src={play} className={styles.play} />)}
                    </div>
                </div>
                <div className={styles.data}>
                    <span onMouseDown={clicked} onMouseUp={(e, url) => openPage(e, `/album/${props.data.id}`)} className={styles.name+" "+(props.data.songIds.includes(props.currentSong.id) ? styles.playing : "")} title={(props.data.songIds.includes(props.currentSong.id) ? "A Song From This Album Is Playing" : "")}>{props.data.name}</span>
                    <span onMouseDown={clicked} onMouseUp={(e, url) => openPage(e, `/artist/${props.data.artistId}`)} className={styles.secondary}>{props.data.artistName}</span>
                    <span className={styles.secondary} style={{userSelect: "none", cursor: "context-menu", textDecoration: "none"}}>{`${props.data.songIds.length} Songs`}</span>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        play: state.audioPlaying,
        currentSong: state.currentSong,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setPlay: (play) => dispatch({type: "SET_PLAYING", play: play}),
        setTrack: (id, playlist, play) => dispatch(setNewSong(id, playlist, play))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SliderAlbum);