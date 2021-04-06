import React, {useState, useEffect, useCallback} from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import styles from './QueueSong.module.css';

import Button from '../Button/Button'

import like from '../../assets/like.svg';
import liked from '../../assets/liked.svg';
import upload from '../../assets/upload.svg';
import options from '../../assets/options.svg';

import {setNewSong} from '../../store/actions';
import { changeLike } from '../../commonActions';

function QueueSong(props) {
    const current = props.currentSong.id === props.data.id;

    const play = e => {
        if(e.target.tagName.toLowerCase() !== 'button' && e.target.tagName.toLowerCase() !== 'img' && e.target.tagName.toLowerCase() !== 'a') {
            props.setTrack({
                id: props.data.id,
                playlist: props.playlist,
                play: true,
                uploads: props.playingFromUploads
            });
        }
        else {
            return;
        }
    }

    const likeHandler = async (songId, isLiked) => {
        const likePromise = await changeLike(songId, isLiked);
    }

    let img, buttons;

    if(props.playingFromUploads) {
        img = <div className='songImg'><img src={upload} className={styles.uploadIcon} /></div>;
        buttons = <Button shape="queueOptions">
                    <img src={options} className={styles.icon} />
                </Button>;
    }
    else {
        img = <div className={styles.songImg} style={{backgroundImage: "url("+props.data.imgUrl+")"}}></div>;
        buttons = <React.Fragment>
                <Button shape="queueOptions" click={(id, like) => likeHandler(props.data.id, props.data.isLiked)}>
                    {(props.data.isLiked ? <img src={liked} className={styles.icon} /> : <img src={like} className={styles.icon} />)}
                </Button>
                <Button shape="queueOptions">
                    <img src={options} className={styles.icon} />
                </Button>
        </React.Fragment>;
    }
    
    return (
        <div className={styles.song} onClick={play}>
            <div className={styles.songData}>
                {img}
                <span className={styles.songName+" "+(current ? styles.playing : "")}>{props.data.name}</span>
            </div>
            <Link to={`/artist/${props.data.artistId}`} className={styles.artist}>{props.data.artistName}</Link>
            <div className={styles.options}>
                {buttons}
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
export default connect(mapStateToProps, mapDispatchToProps)(QueueSong);