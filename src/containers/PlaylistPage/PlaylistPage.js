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


class PlaylistPage extends Component {
    state = {
        loading: true,
        playlistData: {},
        songs: [],
        artists: [],
        artistImg: null,
        userData: null,
        id: null,
        noSongs: null
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
            console.log(response);
            let playlistData, songs, noSongs, artistImg, artists;

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
                    artistImg = response[1].data.data.songs[0].artistImg;
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
                artistImg: artistImg,
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

    play = () => {
        if(this.state.playlistData.songIds === null) return;
        if(!this.state.playlistData.songIds.includes(this.props.currentSong.id)) {
            this.props.setTrack(this.state.playlistData.songIds[0], this.state.playlistData.songIds, true);
        }
        else {
            this.props.setPlay(!this.props.play);
        }
    }

    render() {
        let content;
        if(this.state.loading) {
            content = <Spinner shape="buttonSpinner" />;
        }
        else if(!this.state.loading){
            let songs, img;
            if(this.state.noSongs) {
                songs = <span className={styles.noSongs}>This Playlist Has No Songs</span>;
                img =  <div className={styles.placeholder}><img src={playlist} style={{width: '17px', height: '17px'}} /></div>;
            }
            else {
                songs = <React.Fragment>
                            <Playlist songsArray={this.state.songs} />
                            <Slider itemLength="4" itemType="artist" title="Artists In This Playlist" items={this.state.artists} /> 
                        </React.Fragment>;
                img = <div className={styles.img} style={{backgroundImage: `url(${this.state.artistImg})`}}></div>
            }
            content = <React.Fragment>
            <div className={styles.playlistData}>
                {img}
                <div className={styles.data}>
                    <div className={styles.basicData}>
                        <span className={styles.name}>
                            {this.state.playlistData.name}
                            {(this.state.playlistData.songIds !== null && this.state.playlistData.songIds.includes(this.props.currentSong.id) && this.props.play ? <img src={pause} className={styles.play} onClick={this.play} /> : <img src={play} className={styles.play}  onClick={this.play}/>)}
                        </span>
                        <span className={styles.sec}>{`${this.state.playlistData.songIds !== null && this.state.playlistData.songIds.length > 0 ? this.state.playlistData.songIds.length : 'No'} Songs`}</span>
                        <span className={styles.sec}>{`Created at ${this.state.playlistData.date}`}</span>
                    </div>
                    <div className={styles.options}><Button shape="queueOptions"><img src={options} className={styles.optionsIcon}/></Button></div>
                </div>
            </div>
            <div className={styles.playlistContent}>
                {songs}
            </div>
            </React.Fragment>;        
        }

        return (
            <div className={"mainContentContainer"}>
                <div className={"contentContainer"+" "+(this.state.loading ? styles.loading : "")}>
                    {content}
                </div>
            </div>
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
