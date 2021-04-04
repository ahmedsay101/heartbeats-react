import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import styles from './Queue.module.css';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';

import { setNewSong } from '../../store/actions';
import { changeLike } from '../../commonActions';


import like from '../../assets/like.svg';
import liked from '../../assets/liked.svg';
import options from '../../assets/options.svg';

class Queue extends Component {

    state = {
        loading: true,
        songs: [],
        currentPlaylist: [],
        currentSong: {},
        currentIndex: 0,
    }

    componentDidMount() {
        this.populate(this.props);
    }

    componentWillReceiveProps(props) {
        if(props.currentSong !== this.state.currentSong || props.currentIndex !== this.state.currentIndex) {
            this.setState({
                currentSong: props.currentSong,
                currentIndex: props.currentIndex,
            });
        }
        this.populate(props);
    }

    populate = props => {
        if(props.currentPlaylistSongs.length < 1) {
            if(props.currentPlaylist.length > 0) {
                if(props.currentPlaylist !== this.state.currentPlaylist) {                
                    const promises = [];
                    const songsArray = [];
                    props.currentPlaylist.forEach(id => {
                        const request = axios({ method: "GET", url: "songs/" + id});
                        promises.push(request);
                    });
                    Promise.all(promises).then(response => {
                        response.forEach(res => {
                            if(res.status === 200) {
                                songsArray.push(res.data.data);
                            }
                        });
                        this.setState({
                            songs: songsArray,
                            loading: false,
                            currentPlaylist: props.currentPlaylist
                        });
                    });
                }
                else {
                    return;
                }
            }
            else {
                return;
            }
        }
        else {
            if(props.currentPlaylistSongs !== this.state.songs) {
                this.setState({
                    songs: props.currentPlaylistSongs,
                    loading: false
                });
            }
        }
    }

    playSong = (e, id) => {
        if(e.target.tagName.toLowerCase() === "img" || e.target.tagName.toLowerCase() === "button") {
            if(e.target.tagName.toLowerCase() === "img") {
                if(e.target.id !== "songImg") {
                    return;
                }
            }
        }
        this.props.setTrack(id, this.state.currentPlaylist, true);
    }

    changeLike = (songId, isLiked) => {
        changeLike(songId, isLiked).then(res => {
            if(res.status === 200) {
                const newArray = this.state.songs.map(song  => {
                    if(song.id === songId) {
                       return Object.assign({}, song, {isLiked: res.config.method.toLowerCase() === "post"});
                    }
                    else { 
                        return song;
                    }
                });
                this.setState({songs: newArray});
                this.props.changeLike(res.config.method.toLowerCase() === "post");
            }
        });
    }

    render() {
        let content;
        if(this.state.loading) {
            content = <Spinner shape="buttonSpinner" />
        }
        else if(this.state.songs.length > 0) {
            content = this.state.songs.map(song => (
                <div key={song.id+Math.random()*11} className={styles.queueRow} onClick={(e, id) => this.playSong(e, song.id)}>
                    <div className={styles.queueSongData}>
                        <img id="songImg" src={song.imgUrl} className={styles.queueImg}/>
                        <span className={styles.queueSongName+" "+(this.props.currentSong.id == song.id ? styles.playing : "")}>{song.name}</span>
                    </div>
                    <span className={styles.artistName}>{song.artistName}</span>
                    <div className={styles.queueOptions}>
                        <Button shape="queueOptions" click={(id, like) => this.changeLike(song.id, song.isLiked)}>
                            {(song.isLiked ? <img src={liked} className={styles.queueIcons} /> : <img src={like} className={styles.queueIcons} />)}
                        </Button>
                        <Button shape="queueOptions">
                            <img src={options} className={styles.queueIcons} />
                        </Button>
                    </div>
                </div>
            ));
        }
        return (
            <div 
            className={styles.queueContainer+" "+(!this.props.show ? styles.hide : "")+" "+(this.state.loading ? styles.flexCenter : styles.flexStart)} 
            ref={this.props.queueRef}
            >{content}</div>
        );
    }
}
const mapStateToProps = state => {
    return {
        show: state.showQueue,
        isPlaying: state.audioPlaying,
        currentSong: state.currentSong,
        currentIndex: state.currentIndex,
        currentPlaylist: state.currentPlaylist,
        currentPlaylistSongs: state.currentPlaylistSongs
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setTrack: (id, playlist, play) => dispatch(setNewSong(id, playlist, play)),
        showQueue: (show) => dispatch({type: "SHOW_QUEUE", show: show}),
        changeLike: (like) => dispatch({type: "CHANGE_LIKE", like: like})

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Queue);