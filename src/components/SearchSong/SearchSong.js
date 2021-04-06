import React, {useState, useEffect, useCallback} from 'react';
import styles from './SearchSong.module.css';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import play from "../../assets/dark-play.svg";
import pause from "../../assets/dark-pause.svg";
import like from '../../assets/dark-like.svg';
import liked from '../../assets/dark-liked.svg';
import options from '../../assets/dark-options.svg';

import {changeLike} from '../../commonActions';

import {setNewSong} from '../../store/actions';
import Button from '../Button/Button';


function SearchSong(props) {
    const current = props.currentSong.id === props.songData.id && !props.playingFromUploads;
    
    const likeHandler = async (songId, isLiked) => {
        const likePromise = await changeLike(songId, isLiked);
    }

    const playSong = () => {
        if(current) {
            props.setPlay(!props.play);
        }
        else {
            props.setTrack({id: props.songData.id, playlist: props.currentPlaylist, play: true, uploads: false});
        }
    }

    return (
        <div className={"result"+ " " +(props.searchResultsLength === 1 ? "noBorder" : "")}>
            <div className={styles.rightSec}>
                <img src={props.songData.imgUrl} className={styles.searchImg}/>
                <span className={styles.smallTxt + " " + (current ? styles.playing : "")}>{props.songData.name}</span>
            </div>
            <Link to={"/artist/"+props.songData.artistName} className={"link "+styles.artist}><span className={styles.miniTxt}>{props.songData.artistName}</span></Link>
            <div className={styles.options}>
                <Button shape="queueOptions" click={playSong}>
                    {(props.play && current ? <img src={pause} className={styles.optionsImg} /> : <img src={play} className={styles.optionsImg} />)}
                </Button>
                <Button shape="queueOptions" click={(id, like) => likeHandler(props.songData.id, props.songData.isLiked)}>
                    {(props.songData.isLiked ? <img src={liked} className={styles.optionsImg} /> : <img src={like} className={styles.optionsImg} />)}
                </Button>     
                <Button shape="queueOptions">
                    <img src={options} className={styles.optionsImg} />
                </Button>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        play: state.audioPlaying,
        currentSong: state.currentSong,
        currentPlaylist: state.currentPlaylist,
        currentIndex: state.currentIndex,
        playingFromUploads: state.playingFromUploads
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setPlay: (play) => dispatch({type: "SET_PLAYING", play: play}),
        setTrack: (id, playlist, play) => dispatch(setNewSong(id, playlist, play)),
        changeLike: (like) => dispatch({type: "CHANGE_LIKE", like: like})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchSong);



