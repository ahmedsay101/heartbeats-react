import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styles from './PlaylistHeader.module.css';
import more from '../../assets/more.svg';
import playIcon from '../../assets/play.svg';
import pause from '../../assets/pause.svg';
import playlistDetails from '../../assets/playlistDetails.svg';
import playlist from '../../assets/playlist.svg';
import { setNewSong } from '../../store/actions';
import { calculateOptionsPosition, deletePlaylist } from '../../commonActions';
import Options from '../Options/Options';
import Confirmation from '../Confirmation/Confirmation';
import Floating from '../../containers/Floating/Floating';

const PlaylistHeader = props => {
    const history = useHistory();
    const [showOptions, setShowOptions] = useState(false);
    const [optionsPosition, setOptionsPosition] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const optionsBtn = useRef(null);

    const play = () => {
        if(props.playlistData.songIds === null) return;
        if(!props.playlistData.songIds.includes(props.currentSong.id)) {
            props.setTrack({id: props.playlistData.songIds[0], playlist: props.playlistData.songIds, play: true});
        }
        else {
            props.setPlay(!props.playing);
        }
    }

    const shuffle = () => {
        if(props.playlistData.songIds === null) return;
        props.setTrack({
            id: props.playlistData.songIds[Math.floor(Math.random() * props.playlistData.songIds.length)],
            playlist: props.playlistData.songIds,
            play: true,
            shuffle: true
        });
    }

    const deleteHandler = async() => {
        const deletePromise = await deletePlaylist(props.playlistData.id);
        if(deletePromise) {
            history.push({
                pathname: '/playlists',
                state: { 
                  comingFromDeleted: true
                }
              }); 
        }
    }

    const songOptions = [{
        text: 'Delete',
        todo: () => setDeleteConfirmation("Are You Sure You Want To Delete This Playlist ?")
    }];

    const optionsClickHandler = () => {
        setOptionsPosition(calculateOptionsPosition(optionsBtn.current, songOptions.length, true));
        setShowOptions(!showOptions);
    }

    return (
        <React.Fragment>
            {( deleteConfirmation !== null ? <Floating open={true} destroy={() => setDeleteConfirmation(null)}><Confirmation msg={deleteConfirmation} confirm={deleteHandler} destroy={() => setDeleteConfirmation(null)}/></Floating> : null)}
            {(showOptions ? <Options position={optionsPosition} options={songOptions} destroy={() => setShowOptions(false)} /> : null)}
            <div className={styles.header}>
            <div className={styles.main}>
                {(props.noSongs ? <div className={styles.placeholder}><img src={playlist} style={{width: '20px', height: '20px'}} /></div> : <div className={styles.img} style={{backgroundImage: `url(${props.img})`}}></div>)}
                <div className={styles.data}>
                    <div className={styles.basicData}>
                        <span className='pageMainTitle'>
                            {props.playlistData.name}
                            {(props.playlistData.songIds !== null && props.playlistData.songIds.includes(props.currentSong.id) && props.playing ? <img src={pause} className={styles.play} onClick={play} /> : <img src={playIcon} className={styles.play}  onClick={play}/>)}
                        </span>
                        <span className='flexCenter' style={{padding: '3px 5px'}}><img src={playlistDetails} className={styles.playlistIcon} /><span className='details'>Playlist</span></span>
                        <span className='details'>{`${props.playlistData.songIds !== null && props.playlistData.songIds.length > 0 ? props.playlistData.songIds.length : 'No'} Songs`}</span>
                        <span className='details'>{`Created at ${props.playlistData.date}`}</span>
                    </div>
                </div>
            </div>
            <div className={styles.options}>
                <button className={`${styles.shuffleBtn} ${(props.noSongs ? styles.cantShuffle : '')}`} onClick={shuffle}>Shuffle</button>
                <button className={styles.optionsBtn}><img src={more} className={styles.optionsIcon} ref={optionsBtn} onClick={optionsClickHandler}/></button>
            </div>
        </div>
        </React.Fragment>
    );

}

const mapStateToProps = state => {
    return {
        playing: state.audioPlaying,
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
export default connect(mapStateToProps, mapDispatchToProps)(PlaylistHeader);