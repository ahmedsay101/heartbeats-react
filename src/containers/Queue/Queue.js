import React, {Component} from 'react';
import { connect } from 'react-redux';
import axios from '../../axios';
import styles from './Queue.module.css';
import Spinner from '../../components/Spinner/Spinner';
import QueueSong from '../../components/QueueSong/QueueSong';
import Flash from '../../components/Flash/Flash';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import AudioControls from '../../components/AudioControls/AudioControls';

class Queue extends Component {

    state = {
        loading: true,
        songs: [],
        currentPlaylist: [],
        currentSong: {},
        currentIndex: 0,
        show: false,
        flashMsg: null,
        windowSize: window.innerWidth
    }

    componentDidMount() {
        this.populate(this.props);
        window.addEventListener('resize', this.onResize);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    componentWillReceiveProps(props) {
        if(props.currentSong !== this.state.currentSong || props.currentIndex !== this.state.currentIndex) {
            this.setState({
                currentSong: props.currentSong,
                currentIndex: props.currentIndex,
            });
            this.populate(props);
        }
        this.populate(props);
    }

    onResize = () => {
        this.setState({windowSize: window.innerWidth});
    }

    onDeleteUploaded = id => {
        axios({
            method: 'DELETE',
            url: `users/${localStorage.getItem('userId')}/uploads/${id}`
        }).then(res => {
            if(res.status === 200) {
                const newSongs = this.state.songs.filter(song => song.id != id);
                this.setState({ flashMsg: 'Done!', songs: newSongs });
            }
        }).catch(err => console.log(err.response));
    }

    populate = props => {
        if(props.currentPlaylistSongs.length < 1) {
            if(props.currentPlaylist.length > 0) {
                if(props.currentPlaylist !== this.state.currentPlaylist) {        
                    const promises = [];
                    const songsArray = [];
                    props.currentPlaylist.forEach(id => {
                        const request = axios({ method: "GET", url: props.playingFromUploads ? `users/${localStorage.getItem('userId')}/uploads/${id}` : `songs/${id}`});
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
                        window.addEventListener('like', e => {
                            if(this.state.currentPlaylist.includes(e.detail.id)) {
                                const newSongs = this.state.songs.map(song => {
                                    if(song.id == e.detail.id) {
                                        return {
                                            ...song,
                                            isLiked: e.detail.like
                                        };
                                    }
                                    else {
                                        return song;
                                    }
                                });
                                this.setState({songs: newSongs});
                            }
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


    render() {
        let content;
        if(this.state.loading) {
            content = <Spinner shape="buttonSpinner" />
        }
        else if(this.state.songs.length > 0) {
            content = this.state.songs.map(song => (
                <QueueSong key={Math.random() * 11} data={song} playlist={this.props.currentPlaylist} onDeleteUploaded={this.onDeleteUploaded} parent={this.props.queueRef.current} />
            ));
        }
        return (
            <React.Fragment>
                {(this.state.flashMsg !== null ? <Flash msg={this.state.flashMsg} destroy={() => this.setState({flashMsg: null})} /> : null)}
                <div 
                className={styles.queueContainer+" "+(!this.props.show ? styles.hide : "")+" "+(this.state.loading ? styles.flexCenter : styles.flexStart)} 
                ref={this.props.queueRef}
                >
                {(this.state.windowSize < 800 ?
                <AudioControls 
                onPlay={this.props.onPlay}
                onShuffle={this.props.onShuffle}
                onRepeat={this.props.onRepeat}
                repeat={this.props.repeat}
                shuffle={this.props.shuffle}
                play={this.props.play}
                next={this.props.next}
                previous={this.props.previous}
                /> : null)}
                {content}
                </div>
            </React.Fragment>
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
        currentPlaylistSongs: state.currentPlaylistSongs,
        playingFromUploads: state.playingFromUploads
    }
}
const mapDispatchToProps = dispatch => {
    return {
        showQueue: (show) => dispatch({type: "SHOW_QUEUE", show: show}),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary(Queue));