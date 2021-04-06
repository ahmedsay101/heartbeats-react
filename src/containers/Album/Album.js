import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import styles from './Album.module.css';
import Slider from '../Slider/Slider';
import Playlist from '../Playlist/Playlist'
import Spinner from '../../components/Spinner/Spinner';

import {setNewSong} from '../../store/actions';

import play from '../../assets/play.svg';
import pause from '../../assets/pause.svg';


class Album extends Component {
    state = {
        loading: true,
        albumData: {},
        songs: [],
        otherAlbums: [],
        id: null
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
            axios({method: "GET", url: "albums/"+id}),
            axios({method: "GET", url: "albums/"+id+"/songs"}),
        ];

        Promise.all(promises).then( response => {
            if(response[0].status === 200 && response[1].status === 200) {
                this.setState({
                    albumData: response[0].data.data,
                    songs: response[1].data.data,
                });
                axios({
                    method: "GET",
                    url: "artists/"+this.state.albumData.artistId+"/albums"
                })
                .then(res => {
                    if(res.status === 200) {
                        const otherAlbums = res.data.data.filter(album => album.id != this.state.id);
                        this.setState({otherAlbums: otherAlbums, loading: false});
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
        }).catch(err => {
            console.log(err);
        });
    }

    play = () => {
        if(!this.state.albumData.songIds.includes(this.props.currentSong.id)) {
            this.props.setTrack(this.state.albumData.songIds[0], this.state.albumData.songIds, true);
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
        else {
            content = <React.Fragment>
            <div className={styles.albumData}>
                <div className={styles.img} style={{backgroundImage: "url("+this.state.albumData.imgUrl+")"}}></div>
                <div className={styles.data}>
                    <div className={styles.basicData}>
                        <span className={styles.name}>
                            {this.state.albumData.name}
                            {(this.state.albumData.songIds.includes(this.props.currentSong.id) && this.props.play ? <img src={pause} className={styles.play} onClick={this.play} /> : <img src={play} className={styles.play}  onClick={this.play}/>)}
                        </span>
                        <Link to={`/artist/${this.state.albumData.artistId}`}><span className={styles.sec}>{`Artist: ${this.state.albumData.artistName}`}</span></Link>
                        <span className={styles.sec}>{`${this.state.albumData.songIds.length} Songs`}</span>
                        <span className={styles.sec}>{`${this.state.albumData.plays} Plays`}</span>
                    </div>
                </div>
            </div>
            <Playlist songsArray={this.state.songs} />
            <Slider itemLength="3" itemType="album" title={`Other Albums By ${this.state.albumData.artistName}`} items={this.state.otherAlbums} /> 
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
export default connect(mapStateToProps, mapDispatchToProps)(Album);
