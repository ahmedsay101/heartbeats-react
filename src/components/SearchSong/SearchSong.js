import React, {useState, useRef, useEffect} from 'react';
import styles from './SearchSong.module.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import play from "../../assets/dark-play.svg";
import pause from "../../assets/dark-pause.svg";
import like from '../../assets/dark-like.svg';
import liked from '../../assets/dark-liked.svg';
import optionsIcon from '../../assets/dark-options.svg';
import Button from '../Button/Button';
import {setNewSong, playNext} from '../../store/actions';
import { changeLike, calculateOptionsPosition, authStorageExist } from '../../commonActions';
import Options from '../Options/Options';
import Floating from '../../containers/Floating/Floating';
import AddToPlaylist from '../AddToPlaylist/AddToPlaylist';
import Flash from '../Flash/Flash';


function SearchSong(props) {
    const current = props.currentSong.id === props.songData.id && !props.playingFromUploads;
    const [addToPlaylist, setAddToPlaylist] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [optionsPosition, setOptionsPosition] = useState(null);
    const [flashMsg, setFlash] = useState(null);
    const optionsBtn = useRef(null);

    useEffect(() => {
        if(props.parent) {
            props.parent.addEventListener('scroll', () => {
                setShowOptions(false);
            });
        }
    }, []);

    const likeHandler = async (songId, isLiked) => {
        if(!authStorageExist()) {
            setFlash('Please login or register to like a song');
            return;
        }
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

    const playNextHandler = () => {
        if(props.playingFromUploads) {
            setFlash("Sorry, Can't play next while you're listening to your uploads playlist");
            return;
        }
        if(current) {
            setFlash("Already playing");
            return;
        }
        props.playNext(props.songData.id);
        setFlash("Will Play Next");
    }

    const songOptions = [{
        text: 'Add to playlist',
        todo: () => setAddToPlaylist(true)
    },
    {
        text: 'Play next',
        todo: playNextHandler
    }];

    const optionsClickHandler = () => {
        setOptionsPosition(calculateOptionsPosition(optionsBtn.current, songOptions.length, true));
        setShowOptions(!showOptions);
    }

    return (
        <React.Fragment>
            {(flashMsg !== null ? <Flash msg={flashMsg} destroy={() => setFlash(null)} /> : null)}
            {(addToPlaylist ? <Floating open={addToPlaylist} destroy={() => setAddToPlaylist(false)}><AddToPlaylist songId={props.songData.id} destroy={() => setAddToPlaylist(false)}></AddToPlaylist></Floating>: null)}
            {(showOptions ? <Options position={optionsPosition} options={songOptions} destroy={() => setShowOptions(false)} /> : null)}

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
                    <Button shape="queueOptions" click={optionsClickHandler} forwardedRef={optionsBtn}>
                            <img src={optionsIcon} className={styles.optionsImg} />
                    </Button>
                </div>
            </div>
        </React.Fragment>
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
        changeLike: (like) => dispatch({type: "CHANGE_LIKE", like: like}),
        playNext: (id) => dispatch(playNext(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchSong);



