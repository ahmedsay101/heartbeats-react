import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import styles from './Uploads.module.css';
import UploadedSong from '../../components/UploadedSong/UploadedSong';
import Spinner from '../../components/Spinner/Spinner';
import Flash from '../../components/Flash/Flash';
import add from '../../assets/add.svg';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import { setNewSong } from '../../store/actions';

const Uploads = props => {
    const abortController = new AbortController()

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [flashMsg, setFlash] = useState(null);
    const [songs, setSongs] = useState(null);

    useEffect(() => {
        axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/uploads`}).then(res => {
            setLoading(false);
            if(res.status === 200) {
                setSongs(res.data.data);
            }
            else if (res.status === 204) {
                setSongs(null);
            }
        }).catch(err => {
            setLoading(false);
        });     
    }, []);

    const uploadSong = (file) => {
        const data = new FormData();
        data.append('song', file);
        setUploading(true);
        axios({
            method: 'POST',
            url: `users/${localStorage.getItem('userId')}/uploads`,
            headers: {
                'content-type': 'multipart/form-data'
            },
            data: data
        }).then(response => {
            console.log(response);
            setUploading(false);
            if(songs === null) {
                setSongs([response.data.data]);
            }
            else {
                const newSongs = [...songs];
                newSongs.unshift(response.data.data);
                setSongs(newSongs);
            }
        }).catch(err => {
            console.log(err);
            console.log(err.response);
            setUploading(false);
        });
    };

    const onSelectFile = (event) => uploadSong(event.target.files[0]);

    const onDeleteSong = (id) => {
        axios({
            method: 'DELETE',
            url: `users/${localStorage.getItem('userId')}/uploads/${id}`
        }).then(res => {
            if(res.status === 200) {
                setFlash("Done!");
                const newSongs = songs.filter(song => song.id != id);
                if(newSongs.length === 0) {
                    setSongs(null);
                }
                else {
                    setSongs(newSongs);
                }
                if(props.currentSong.id == id && props.playingFromUploads) {
                    axios({
                        method: "GET",
                        url: "songs/random"
                    })
                    .then(response => {
                        console.log(response);
                        if(response.status === 200) {
                            props.setTrack({
                                id: response.data.data.songId, 
                                playlist: response.data.data.playlist, 
                                play: true
                            });
                        }
                    }).catch(err => console.log(err.response));
                }
            }
        }).catch(err => console.log(err.response));
    }

    let content;
    if(!loading && songs === null) {
        content = <span className={styles.noUploads}>You don't have uploads, Click browse files to upload a song</span>
    }
    else if(!loading && songs){
        content = songs.map(song => {
            return (
                <UploadedSong key={Math.random()*11} data={song} onDelete={onDeleteSong}/>
            );
        });
    }

    return (
        <React.Fragment>
        {(flashMsg !== null ? <Flash msg={flashMsg} destroy={() => setFlash(null)} /> : null)}
        <div className={styles.uploads}>
            <div className={styles.header}>
                <span className={styles.mainText}>Your Uploads</span>
                <div className={styles.fileInput}>
                    <label htmlFor="song" className={styles.button}>{(uploading ? <Spinner shape='buttonSpinner' /> : <React.Fragment><img src={add} className={styles.icon} /><span>Browse Files</span></React.Fragment>)}</label>
                    <input
                        id="song"
                        name="song"
                        style={{display:'none'}}
                        type={"file"}
                        onChange={onSelectFile}
                    />
                </div>
            </div>
            <div className={styles.content} style={{minWidth: !loading && songs === null ? '200px' : 'auto'}}>
                {content}
            </div>
        </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        currentSong: state.currentSong,
        playingFromUploads: state.playingFromUploads
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setPlay: (play) => dispatch({type: "SET_PLAYING", play: play}),
        setTrack: (data) => dispatch(setNewSong(data)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary(Uploads));
