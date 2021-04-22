import React, {useState, useRef} from 'react';
import { connect } from 'react-redux';
import styles from './UploadedSong.module.css';
import Button from '../Button/Button';
import optionsIcon from '../../assets/options.svg';
import upload from '../../assets/upload.svg';
import {setNewSong} from '../../store/actions';
import {calculateOptionsPosition} from '../../commonActions';
import Options from '../Options/Options';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

function UploadedSong(props) {
    const current = props.currentSong.id === props.data.id && props.playingFromUploads;
    const [showOptions, setShowOptions] = useState(false);
    const [optionsPosition, setOptionsPosition] = useState(null);
    const optionsBtn = useRef(null);

    const play = e => {
        if(e.target.id !== 'notClickable') {
            props.setTrack({
                id: props.data.id,
                playlist: props.data.playlist,
                play: true,
                uploads: true
            });
        }
        else {
            return;
        }
    }

    const uploadedOptions = [{
        text: 'Delete',
        todo: () => props.onDelete(props.data.id)
    }];

    const optionsClickHandler = () => {
        setOptionsPosition(calculateOptionsPosition(optionsBtn.current, uploadedOptions.length, true));
        setShowOptions(!showOptions);
    }
    
    return (
        <React.Fragment>
            {(showOptions ? <Options position={optionsPosition} options={uploadedOptions} destroy={() => setShowOptions(false)} /> : null)}
            <div className={styles.song} onClick={play}>
                <div className={styles.songData}>
                    <div className={styles.songImg}><img src={upload} className={styles.up} /></div>
                    <span className={styles.songName+" "+(current ? styles.playing : "")} title={props.data.name}>{props.data.name}</span>
                </div>
                <div className={styles.options}>
                    <Button id='notClickable' shape="queueOptions" click={optionsClickHandler} forwardedRef={optionsBtn}>
                        <img id='notClickable' src={optionsIcon} className={styles.icon} />
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        isPlaying: state.audioPlaying,
        currentSong: state.currentSong,
        currentIndex: state.currentIndex,
        currentPlaylist: state.currentPlaylist,
        playingFromUploads: state.playingFromUploads,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setTrack: (data) => dispatch(setNewSong(data)),
        setPlay: (play) => dispatch({type: "SET_PLAYING", play: play})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary(UploadedSong));