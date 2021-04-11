import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './UserPlaylist.module.css';

import Button from '../Button/Button';
import options from '../../assets/options.svg';
import playlist from '../../assets/playlist.svg';

import {setNewSong} from '../../store/actions';
import axios from 'axios';

const UserPlaylist = props => {
    const history = useHistory();
    const [playlistImg, setPlaylistImg] = useState(
        <div className={styles.placeholderImg}>
            <img src={playlist} className={styles.plIcon} />
        </div>
    );

    useEffect(() => {
        if(props.data.songIds !== null && props.data.songIds.length > 0) {
            axios({
                method: 'GET',
                url: `songs/${props.data.songIds[0]}`
            }).then( res => {
                if(res.status === 200) setPlaylistImg(<div className={styles.playlistImg} style={{backgroundImage: `url(${res.data.data.imgUrl})`}}></div>); 
            });
        }
        return () => {
            setPlaylistImg(null);
        }
    }, []);

    const nav = e => {
        if(e.target.id === 'notClickable' || e.target.classList.contains('notClickable')) return;
        history.push(`playlist/${props.data.id}`);
    }
    
    return (
        <div className={styles.playlist} onClick={nav}>
            <div className={styles.playlistData}>
                {playlistImg}
                <span className={styles.playlistName}>{props.data.name}</span>
            </div>
            <span className={styles.sec}>{`${(props.data.songIds !== null && props.data.songIds.length > 0 ? props.data.songIds.length : 'No')} Songs`}</span>
            <div className={styles.options}>
                <Button shape="queueOptions" id='notClickable'>
                    <img  src={options} className={`${styles.icon} notClickable`} />
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
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(UserPlaylist));