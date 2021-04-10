import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './Artist.module.css';
import Slider from '../Slider/Slider';
import Playlist from '../Playlist/Playlist'
import Spinner from '../../components/Spinner/Spinner';

import {setNewSong} from '../../store/actions';

import play from '../../assets/play.svg';
import pause from '../../assets/pause.svg';
import ArtistHeader from '../../components/ArtistHeader/ArtistHeader';

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
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        let content;
        if(this.state.loading) {
            content = <Spinner shape="buttonSpinner" />;
        }
        else {
            content = <React.Fragment>
                <ArtistHeader artistData={this.state.artistData} songIds={this.state.songIds} albumsLength={this.state.albums.length} />
                <Slider itemLength="3" itemType="album" title="Albums" items={this.state.albums} /> 
                <Playlist title="Popular Songs" songsArray={this.state.songsArray} options={[{
                    text: 'Add to playlist',
                    todo: 'ADD_TO_PLAYLIST'
                }]}/>
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
        setTrack: (data) => dispatch(setNewSong(data)),
        setPlay: (play) => dispatch({type: "SET_PLAYING", play: play})

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Artist);
