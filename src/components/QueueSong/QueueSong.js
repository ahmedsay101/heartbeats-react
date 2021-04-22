import React, {useEffect, useState, useRef} from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import styles from './QueueSong.module.css';
import Button from '../Button/Button'
import like from '../../assets/like.svg';
import liked from '../../assets/liked.svg';
import upload from '../../assets/upload.svg';
import optionsIcon from '../../assets/options.svg';
import {setNewSong} from '../../store/actions';
import { authStorageExist, changeLike, calculateOptionsPosition } from '../../commonActions';
import Options from '../Options/Options';
import Floating from '../../containers/Floating/Floating';
import AddToPlaylist from '../AddToPlaylist/AddToPlaylist';
import Flash from '../Flash/Flash';

const QueueSong = props => {
    const current = props.currentSong.id === props.data.id;
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
        if(!authStorageExist()) {
            setFlash("Please login or register, so you can like songs");
            return;
        }
        const likePromise = await changeLike(songId, isLiked);
    }

    let options = props.playingFromUploads ? [{
        text: 'Delete from uploads',
        todo: () => props.onDeleteUploaded(props.data.id)
    }] : [{
        text: 'Add to playlist',
        todo: () => setAddToPlaylist(true)
    }];

    const optionsClickHandler = () => {
        setOptionsPosition(calculateOptionsPosition(optionsBtn.current, options.length, true));
        setShowOptions(!showOptions);
    }

    let img, buttons;

    if(props.playingFromUploads) {
        img = <div className='songImg'><img src={upload} className={styles.uploadIcon} /></div>;
        buttons = <Link className={styles.fromuploads} to='/uploads'>From Uploads</Link>
    }
    else {
        img = <div className={styles.songImg} style={{backgroundImage: "url("+props.data.imgUrl+")"}}></div>;
        buttons = <React.Fragment>
                <Button shape="queueOptions" click={(id, like) => likeHandler(props.data.id, props.data.isLiked)}>
                    {(props.data.isLiked ? <img src={liked} className={styles.icon} /> : <img src={like} className={styles.icon} />)}
                </Button>
                <Button shape="queueOptions" click={optionsClickHandler} forwardedRef={optionsBtn}>
                    <img src={optionsIcon} className={styles.icon} />
                </Button>
        </React.Fragment>;
    }
    
    return (
        <React.Fragment>
            {(flashMsg !== null ? <Flash msg={flashMsg} destroy={() => setFlash(null)} /> : null)}
            {(addToPlaylist ? <Floating open={addToPlaylist} destroy={() => setAddToPlaylist(false)}><AddToPlaylist songId={props.data.id} destroy={() => setAddToPlaylist(false)}></AddToPlaylist></Floating>: null)}
            {(showOptions ? <Options position={optionsPosition} options={options} destroy={() => setShowOptions(false)} /> : null)}

            <div className={styles.song} onClick={play}>
                <div className={styles.songData}>
                    {img}
                    <span className={styles.songName+" "+(current ? styles.playing : "")} title={props.data.name}>
                        {props.data.name}
                    </span>
                </div>
                <Link to={`/artist/${props.data.artistId}`} className={styles.artist}>{props.data.artistName}</Link>
                <div className={styles.options}>
                    {buttons}
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
export default connect(mapStateToProps, mapDispatchToProps)(QueueSong);