import React, { useEffect, useState } from 'react';
import axiosWithoutError from 'axios';
import axios from '../../axios';
import { connect } from 'react-redux';
import styles from './ArtistHeader.module.css';
import checked from '../../assets/checked.svg';
import playIcon from '../../assets/play.svg';
import pause from '../../assets/pause.svg';
import {setNewSong} from '../../store/actions';
import {isAuthenticated} from '../../commonActions';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const ArtistHeader = props => {
    const [authenticated, setAuthenticated] = useState(null);
    const [following, setFollowing] = useState(null);

    useEffect(() => {
        axiosWithoutError({method: 'GET', url: `users/${localStorage.getItem('userId')}/artists`}).then(res => {
            if(res.data.data.map(artist => artist.id).includes(props.artistData.id)) {
                setFollowing(true);
            }
            else {
                setFollowing(false);
            }
        }).catch(err => console.log(err));
        auth();
    }, []);

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
            props.setPlay(!props.playing);
        }
    }

    const follow = () => {
        if(!following) {
            axios({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST', 
                url: `users/${localStorage.getItem('userId')}/artists`,
                data: JSON.stringify({artistId: props.artistData.id})
            }).then(res => {
                if(res.status === 201) {
                    setFollowing(true);
                }
            }).catch(err => console.log(err));
        }
        else if(following) {
            axios({method: 'DELETE', url: `users/${localStorage.getItem('userId')}/artists/${props.artistData.id}`}).then(res => {
                if(res.status === 200) {
                    setFollowing(false);
                }
            }).catch(err => console.log(err.response));
        }
    }

    const auth = async () => {
        const isAuth = await isAuthenticated();
        setAuthenticated(isAuth);
    }

    return (
        <div className={styles.header}>
            <div className={styles.img} style={{backgroundImage: "url("+props.artistData.imgUrl+")"}}></div>
            <div className={styles.data}>
                <div className={styles.basicData}>
                    <span className='pageMainTitle'>
                        {props.artistData.name}
                        {(props.songIds.includes(props.currentSong.id) && props.playing ? <img src={pause} className={styles.play} onClick={play} /> : <img src={playIcon} className={styles.play}  onClick={play}/>)}
                    </span>
                    <span className='details'>{`${props.songIds.length} Songs | ${props.albumsLength} Albums | ${props.artistData.plays} Plays`}</span>
                    {( authenticated ? <button className={styles.followBtn} onClick={follow}>{(following ? <React.Fragment><img src={checked} className={styles.checked} /><span>Following</span></React.Fragment> : 'Follow')}</button> : null)}
                </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary(ArtistHeader));