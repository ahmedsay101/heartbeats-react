import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './AlbumHeader.module.css';

import more from '../../assets/more.svg';
import playIcon from '../../assets/play.svg';
import pause from '../../assets/pause.svg';
import albumic from '../../assets/albumic.svg';

import {setNewSong} from '../../store/actions';

const AlbumHeader = props => {

    const play = () => {
        if(!props.albumData.songIds.includes(props.currentSong.id)) {
            props.setTrack({id: props.albumData.songIds[0], playlist: props.albumData.songIds, play: true});
        }
        else {
            props.setPlay(!props.playing);
        }
    }

    const shuffle = () => {
        props.setTrack({
            id: props.albumData.songIds[Math.floor(Math.random() * props.albumData.songIds.length)],
            playlist: props.albumData.songIds,
            play: true,
            shuffle: true
        });
    }

    return (
        <div className={styles.header}>
            <div className={styles.main}>
                <div className={styles.img} style={{backgroundImage: `url(${props.albumData.imgUrl})`}}></div>
                <div className={styles.data}>
                    <div className={styles.basicData}>
                        <span className='pageMainTitle'>
                            {props.albumData.name}
                            {(props.albumData.songIds.includes(props.currentSong.id) && props.playing ? <img src={pause} className={styles.play} onClick={play} /> : <img src={playIcon} className={styles.play}  onClick={play}/>)}
                        </span>
                        <span className='flexCenter' style={{padding: '3px 5px'}}><img src={albumic} className={styles.playlistIcon} /><span className='details'>Album</span></span>
                        <span className='details'>By <Link className={styles.artistLink} to={`/artists/${props.albumData.artistId}`}>{props.albumData.artistName}</Link></span>
                        <span className='details'>{`${props.albumData.songIds.length} Songs | ${props.albumData.plays} Plays`}</span>
                        <span className='details'>{`year: ${props.albumData.year}`}</span>
                    </div>
                </div>
            </div>
            <div className={styles.options}>
                <button className={styles.shuffleBtn} onClick={shuffle}>Shuffle</button>
            </div>
        </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(AlbumHeader);