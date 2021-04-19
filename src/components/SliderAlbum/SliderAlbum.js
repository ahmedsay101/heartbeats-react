import {React, useEffect, useState} from 'react';
import styles from './SliderAlbum.module.css';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import play from "../../assets/play.svg";
import pause from "../../assets/pause.svg";
import { setNewSong } from '../../store/actions';

function SliderAlbum(props) {
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
        if(windowSize > 600) {  
            if(mousePosition !== e.clientX) return;
        }
        if(!props.data.songIds.includes(props.currentSong.id)) {
            props.setTrack({id: props.data.songIds[0], playlist: props.data.songIds, play: true});
        }
        else {
            props.setPlay(!props.play);
        }
    }

    const history = useHistory();
    const openPage = (e, url) => {
        if(windowSize > 600) {  
            if(mousePosition !== e.clientX) return;
        }
        history.push(url);
    }
    if (windowSize > 600) {
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
    else if (windowSize <= 600) {
        return (
            <div className={styles.container} style={{"width": props.width}}>
                <div className={styles.inside}>
                    <div className={styles.albumImg}>
                        <div className={styles.imgHolder} style={{backgroundImage: "url("+props.data.imgUrl+")"}}></div>
                    </div>
                    <div className={styles.data}>
                        <span onClick={(e, url) => openPage(e, `/album/${props.data.id}`)} className={styles.name+" "+(props.data.songIds.includes(props.currentSong.id) ? styles.playing : "")} title={(props.data.songIds.includes(props.currentSong.id) ? "A Song From This Album Is Playing" : "")}>{props.data.name}</span>
                        <span onClick={(e, url) => openPage(e, `/artist/${props.data.artistId}`)} className={styles.secondary}>{props.data.artistName}</span>
                        <span className={styles.secondary} style={{userSelect: "none", cursor: "context-menu", textDecoration: "none"}}>{`${props.data.songIds.length} Songs`}</span>
                    </div>
                </div>
                <button className={styles.mobPlay} onClick={playSong}>
                    {(props.play && props.data.songIds.includes(props.currentSong.id) ? <img src={pause} className={styles.play} /> : <img src={play} className={styles.play} />)}
                </button>
            </div>
        );
    }
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
        setTrack: (data) => dispatch(setNewSong(data))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SliderAlbum);