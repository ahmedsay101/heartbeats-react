import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import styles from './PlaylistSong.module.css';

import Button from '../Button/Button'

import like from '../../assets/like.svg';
import liked from '../../assets/liked.svg';
import options from '../../assets/options.svg';

import {setNewSong} from '../../store/actions';
import { changeLike } from '../../commonActions';

function PlaylistSong(props) {
    const current = props.currentSong.id === props.data.id && !props.playingFromUploads;

    const play = e => {
        if(e.target.tagName.toLowerCase() !== 'button' && e.target.tagName.toLowerCase() !== 'img' && e.target.tagName.toLowerCase() !== 'a') {
            props.setTrack({id: props.data.id, playlist: props.playlist, play: true, uploads: false});
        }
        else {
            return;
        }
    }

    const likeHandler = async (songId, isLiked) => {
        const likePromise = await changeLike(songId, isLiked);
    }

    return (
        <div className={styles.song} onClick={play} >
            <div className={styles.songData}>
                <div className={styles.songImg} style={{backgroundImage: "url("+props.data.imgUrl+")"}}></div>
                <span className={styles.songName+" "+(current ? styles.playing : "")}>{props.data.name}</span>
            </div>
            <Link to={`/artist/${props.data.artistId}`} className={styles.artist}>{props.data.artistName}</Link>
            <div className={styles.options}>
                <Button shape="queueOptions" click={(id, like) => likeHandler(props.data.id, props.data.isLiked)}>
                    {(props.data.isLiked ? <img src={liked} className={styles.icon} /> : <img src={like} className={styles.icon} />)}
                </Button>
                <Button shape="queueOptions">
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
        changeLike: (like) => dispatch({type: "CHANGE_LIKE", like: like}),
        setPlay: (play) => dispatch({type: "SET_PLAYING", play: play})

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PlaylistSong);