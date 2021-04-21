import React, {Component} from 'react';
import axios from '../../axios';
import { connect } from 'react-redux';
import styles from './Artist.module.css';
import Slider from '../Slider/Slider';
import Playlist from '../Playlist/Playlist'
import Spinner from '../../components/Spinner/Spinner';
import {setNewSong} from '../../store/actions';
import ArtistHeader from '../../components/ArtistHeader/ArtistHeader';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

class Artist extends Component {
    state = {
        loading: true,
        artistData: {},
        songsArray: [],
        albums: [],
        songIds: [],
        id: null
    }

    componentDidMount() {
        this.init(this.props.match.params.id);
        window.addEventListener('like', this.onLikeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('like', this.onLikeHandler);
    }

    onLikeHandler = e => {
        if(this.state.songsArray.map(song => song.id).includes(e.detail.id)) {
            const newSongs = this.state.songsArray.map(song => {
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
            this.setState({songsArray: newSongs});
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
            axios({method: "GET", url: "artists/"+id}),
            axios({method: "GET", url: "artists/"+id+"/songs"}),
            axios({method: "GET", url: "artists/"+id+"/albums"}),
        ];

        Promise.all(promises).then( response => {
            if(response[0].status === 200 && response[1].status === 200 && response[2].status === 200) {
                const songIds = response[1].data.data.map(song => {
                    return song.id;
                });
                this.setState({
                    artistData: response[0].data.data,
                    songsArray: response[1].data.data,
                    albums: response[2].data.data,
                    songIds: songIds,
                    loading: false
                });
            }
        }).catch(err => console.log(err));
    }

    render() {
        let content;
        if(this.state.loading) {
            content = <Spinner shape="buttonSpinner" />;
        }
        else {
            content = <React.Fragment>
                <ArtistHeader artistData={this.state.artistData} songIds={this.state.songIds} albumsLength={this.state.albums.length} />
                <Slider itemType="album" title="Albums" items={this.state.albums} /> 
                <Playlist title="Popular Songs" songsArray={this.state.songsArray} options={[{
                    text: 'Add to playlist',
                    todo: 'ADD_TO_PLAYLIST'
                },
                {
                    text: 'Play next',
                    todo: 'PLAY_NEXT'
                }]}/>
            </React.Fragment>;        
        }

        return (
            <div className={"contentContainer"+" "+(this.state.loading ? styles.loading : "")}>
                {content}
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
        setTrack: (data) => dispatch(setNewSong(data)),
        setPlay: (play) => dispatch({type: "SET_PLAYING", play: play})

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary(Artist));
