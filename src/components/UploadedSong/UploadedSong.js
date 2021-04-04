import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import styles from './UploadedSong.module.css';

import Button from '../Button/Button';
import options from '../../assets/options.svg';
import upload from '../../assets/upload.svg';

import {setNewSong} from '../../store/actions';

function UploadedSong(props) {
    const current = props.currentSong.id === props.data.id && props.playingFromUploads;

    const play = e => {
        if(e.target.id !== 'notClickable') {
            console.log("clicked");
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
    
    return (
        <div className={styles.song} onClick={play}>
            <div className={styles.songData}>
                <div className={styles.songImg}><img src={upload} className={styles.up} /></div>
                <span className={styles.songName+" "+(current ? styles.playing : "")}>{props.data.name}</span>
            </div>
            <div className={styles.options}>
                <Button shape="queueOptions" id='notClickable'>
                    <img src={options} className={styles.icon} />
                </Button>
            </div>
        </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(UploadedSong);