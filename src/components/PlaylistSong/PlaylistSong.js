import React, {useState, useRef} from 'react';
import { connect} from 'react-redux';
import {Link} from 'react-router-dom';
import styles from './PlaylistSong.module.css';
import Button from '../Button/Button'

import like from '../../assets/like.svg';
import liked from '../../assets/liked.svg';
import optionsIcon from '../../assets/options.svg';

import {setNewSong, playNext} from '../../store/actions';
import { changeLike, calculateOptionsPosition } from '../../commonActions';
import Options from '../Options/Options';
import Floating from '../../containers/Floating/Floating';
import AddToPlaylist from '../AddToPlaylist/AddToPlaylist';
import Flash from '../Flash/Flash';


function PlaylistSong(props) {
    console.log(props.deleteFromPlaylist);
    const current = props.currentSong.id === props.data.id && !props.playingFromUploads;
    const [addToPlaylist, setAddToPlaylist] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [optionsPosition, setOptionsPosition] = useState(null);
    const [flashMsg, setFlash] = useState(null);
    const optionsBtn = useRef(null);

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

    const optionsClickHandler = () => {
        if(props.options) {
            setOptionsPosition(calculateOptionsPosition(optionsBtn.current, props.options.length));
            setShowOptions(!showOptions);
        }
    }

    const openAddToPlaylist = (todo) => {
        setAddToPlaylist(todo);
    }

    const playNextHandler = () => {
        props.playNext(props.data.id);
        setFlash("Will Play Next");
    }

    const optionsFunctions = {
        'ADD_TO_PLAYLIST': (open) => openAddToPlaylist(!addToPlaylist),
        'PLAY_NEXT': () => playNextHandler(),
        'DELETE_FROM_PLAYLIST': () => props.deleteFromPlaylist(props.data.id)
    }

    let generatedOptions = null;

    if(props.options) {
        generatedOptions = props.options.map(option => {
            return {
                ...option,
                text: option.text,
                todo: optionsFunctions[option.todo]
            }
        });
    }

    return (
        <React.Fragment>
            {(flashMsg !== null ? <Flash msg={flashMsg} setMsg={setFlash} /> : null)}
            {(addToPlaylist ? <Floating open={addToPlaylist} close={openAddToPlaylist}><AddToPlaylist close={openAddToPlaylist} songId={props.data.id}></AddToPlaylist></Floating>: null)}
            {(showOptions && props.options ? <Options position={optionsPosition} show={setShowOptions} options={generatedOptions} /> : null)}
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
                    <Button shape="queueOptions" click={optionsClickHandler} forwardedRef={optionsBtn}>
                        <img src={optionsIcon} className={styles.icon} />
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
        playNext: (id) => dispatch(playNext(id)),
        changeLike: (like) => dispatch({type: "CHANGE_LIKE", like: like}),
        setPlay: (play) => dispatch({type: "SET_PLAYING", play: play}),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PlaylistSong);