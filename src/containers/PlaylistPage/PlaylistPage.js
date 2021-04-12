import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import styles from './PlaylistPage.module.css';
import Slider from '..//Slider/Slider';
import Playlist from '../Playlist/Playlist'
import Spinner from '../../components/Spinner/Spinner';
import Button from '../../components/Button/Button';

import {setNewSong} from '../../store/actions';
import {isAuthenticated} from '../../commonActions';

import options from '../../assets/options.svg';
import play from '../../assets/play.svg';
import pause from '../../assets/pause.svg';
import playlist from '../../assets/playlist.svg';
import PlaylistHeader from '../../components/PlaylistHeader/PlaylistHeader';
import Flash from '../../components/Flash/Flash';


class PlaylistPage extends Component {
    state = {
        loading: true,
        playlistData: {},
        songs: [],
        artists: [],
        img: null,
        userData: null,
        id: null,
        noSongs: null,
        flashMsg: null
    }

    componentDidMount() {
        this.init(this.props.match.params.id);
        window.addEventListener('like', this.onLikeHandler);
    }

    onLikeHandler = e => {
        if(this.state.songs.map(song => song.id).includes(e.detail.id)) {
            const newSongs = this.state.songs.map(song => {
                if(song.id == e.detail.id) {
                    return {
                        ...song,
                        isLiked: e.detail.like
                    }
                }
                else {
                    return song;
                }
            });
            this.setState({songs: newSongs});
        }
    }

    componentWillReceiveProps(prevProps) {
        if(prevProps.match.params.id !== this.state.id) {
            this.init(prevProps.match.params.id);
        }
    }

    init = (id) => {
        this.setState({loading: true, id: id});
        const promises = [
            axios({method: "GET", url: "playlists/"+id}),
            axios({method: "GET", url: "playlists/"+id+"/songs"}),
        ];
        Promise.all(promises).then( response => {
            let playlistData, songs, noSongs, img, artists;

            if(response[0].status === 404) {
                this.props.history.push('/notFound');
            }

            if(response[0].status === 200 && response[1].status === 200) {
                playlistData = response[0].data.data;

                if(response[1].data.data.songs === null) {
                    noSongs = true;
                    songs = [];
                    artists = null;
                }
                else {
                    noSongs = false;
                    songs = response[1].data.data.songs;
                    img = response[1].data.data.songs[0].imgUrl;
                }
            }

            if(!noSongs) {
                const jsonArtists = [...new Set(response[1].data.data.songs.map(song => {
                    return JSON.stringify({
                    id: song.artistId,
                    imgUrl: song.artistImg,
                    name: song.artistName
                })}))];

                artists = jsonArtists.map(artist => JSON.parse(artist));
            }

            this.setState({
                playlistData: playlistData,
                songs: songs,
                artists: artists,
                img: img,
                noSongs: noSongs,
                loading: false
            });
            
        })
        .catch(err => {
            console.log(err.response);
            if(err.response.status === 404) {
                this.props.history.push('/notFound');
            }
            else if(err.response.status === 401) {
                this.props.history.push('/');
            }
        });
    }

    deleteSong = (id) => {
        const songIds = this.state.songs.map(song => song.id);
        const newSongIds = songIds.filter(song => song.id != id);
        const data = JSON.stringify({ songIds: newSongIds });
        axios({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'PATCH', 
            url: `playlists/${this.state.playlistData.id}`,
            data: data
        }).then(res => {
            console.log(res);
            if(res.status === 200) {
                this.setState({flashMsg: "A Song is deleted from the playlist!"});
                const newSongs = this.state.songs.filter(item => item.id != id);
                this.setState({songs: newSongs});       
            }
        }).catch(err => console.log(err.response));
    }

    render() {
        let content;
        if(this.state.loading) {
            content = <Spinner shape="buttonSpinner" />;
        }
        else if(!this.state.loading){
            let songs;
            if(this.state.noSongs) {
                songs = <span className={styles.noSongs}>This Playlist Has No Songs</span>;
            }
            else {
                songs = <React.Fragment>
                            <Playlist songsArray={this.state.songs} deleteFromPlaylist={this.deleteSong} options={[{
                    text: 'Add to playlist',
                    todo: 'ADD_TO_PLAYLIST'
                },
                {
                    text: 'Play next',
                    todo: 'PLAY_NEXT'
                },
                {
                    text: 'Delete From Playlist',
                    todo: 'DELETE_FROM_PLAYLIST'
                }]}/>
                            <Slider itemLength="4" itemType="artist" title="Artists In This Playlist" items={this.state.artists} /> 
                        </React.Fragment>;
            }
            content = <React.Fragment>
            <PlaylistHeader playlistData={this.state.playlistData} noSongs={this.state.noSongs} img={this.state.img} />
            <div className={styles.playlistContent}>
                {songs}
            </div>
            </React.Fragment>;        
        }

        return (
            <React.Fragment>
                {(this.state.flashMsg !== null ? <Flash msg={this.state.flashMsg} setMsg={(msg) => this.setState({flashMsg: msg})} /> : null )}
                <div className={"mainContentContainer"}>
                    <div className={"contentContainer"+" "+(this.state.loading ? styles.loading : "")}>
                        {content}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        play: state.audioPlaying,
        currentSong: state.currentSong,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setTrack: (id, playlist, play) => dispatch(setNewSong(id, playlist, play)),
        setPlay: (play) => dispatch({type: "SET_PLAYING", play: play})

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PlaylistPage);
