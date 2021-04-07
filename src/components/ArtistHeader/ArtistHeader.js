import React from 'react';
import { connect } from 'react-redux';
import styles from './ArtistHeader.module.css';

import more from '../../assets/more.svg';
import playIcon from '../../assets/play.svg';
import pause from '../../assets/pause.svg';
import {setNewSong} from '../../store/actions';

const ArtistHeader = props => {

    const play = () => {
        if(!props.songIds.includes(props.currentSong.id)) {
            props.setTrack({
                id: props.songIds[0],
                playlist: props.songIds,
                play: true,
                uploads: false
            });
        }
        else {
            props.setPlay(!props.play);
        }
    }

    return (
        <div className={styles.header}>
            <div className={styles.img} style={{backgroundImage: "url("+props.artistData.imgUrl+")"}}></div>
            <div className={styles.data}>
                <div className={styles.basicData}>
                    <span className='pageMainTitle'>
                        {props.artistData.name}
                        {(props.songIds.includes(props.currentSong.id) && props.play ? <img src={pause} className={styles.play} onClick={play} /> : <img src={playIcon} className={styles.play}  onClick={play}/>)}
                    </span>
                    <span className='details'>{`${props.songIds.length} Songs | ${props.albumsLength} Albums | ${props.artistData.plays} Plays`}</span>
                    <button className={styles.followBtn}>Follow</button>
                </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(ArtistHeader);