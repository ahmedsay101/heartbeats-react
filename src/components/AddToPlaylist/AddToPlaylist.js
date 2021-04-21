import React, {useEffect, useState} from 'react';
import axiosWithoutError from 'axios';
import axios from '../../axios';
import { connect} from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './AddToPlaylist.module.css';
import Spinner from '../Spinner/Spinner';
import Flash from '../Flash/Flash';
import { isAuthenticated } from '../../commonActions';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const AddToPlaylist = props => {
    const [playlists, setPlaylists] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [flashMsg, setFlashMsg] = useState(null);

    useEffect(() => {
        let source = axiosWithoutError.CancelToken.source();
        init(source);

        return () => {
            source.cancel();
        }
    }, []);

    const init = async (src) => {

        const authenticated = await isAuthenticated();
        if(authenticated) {
            axiosWithoutError({
                method: 'GET', 
                url: `users/${localStorage.getItem('userId')}/playlists`,
                cancelToken: src.token
            }).then(res => {
                setUserLoggedIn(true);
                setLoading(false);
                if(res.status === 200) {
                    if(res.data.data.length === 0) {
                        setPlaylists(null);
                    }
                    else {
                        setPlaylists(res.data.data);
                    }
                }
            }).catch(err => setLoading(false));
    
        }
        else {    
            setUserLoggedIn(false);
            setLoading(false); 
        }
    
    }

    const add = playlist => {
        let empty = playlist.songIds === null;
        if(playlist.songIds !== null) {
            if(playlist.songIds.includes(props.songId)) {
                alert("This playlist already has this song");
                return;
            }
        }
        const newPlaylist = playlist.songIds === null ? [props.songId] : [props.songId, ...playlist.songIds];
        axios({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'PATCH', 
            url: `playlists/${playlist.id}`,
            data: JSON.stringify({songIds: newPlaylist}),
        }).then(res => {
            if(res.status === 200) {
                setFlashMsg("Done!");
                const addEvent = new CustomEvent('addToPlaylist', {
					detail: {
						songId: props.songId,
						playlistId: playlist.id
					}
				});
				window.dispatchEvent(addEvent);
                const newPlaylists = playlists.map(item => {
                    if(item.id == playlist.id) {
                        return {
                            ...item, 
                            songIds: newPlaylist,
                            imgUrl: res.data.data.imgUrl
                        }
                    }
                    else {
                        return item;
                    }
                });
                setPlaylists(newPlaylists);        
            }
        }).catch(err => console.log(err.response));
    }

    let content;
    if(loading) {
        content = <Spinner shape='buttonSpinner' />;
    }
    else if (!loading && playlists === null) {
        content = <span className={styles.noPlaylists}>You don't have playlists</span>;
    }
    else if (!loading && playlists !== null && userLoggedIn){
        content = playlists.map(playlist => {
            return (
                <div key={playlist.id} className={styles.playlist} onClick={() => add(playlist)}>
                    <div className={`${styles.img} ${playlist.songIds === null ? styles.noSongsImg : ''}`} style={{backgroundImage: `url(${playlist.imgUrl})`}} />
                    <div className={styles.data}>
                        <span className={styles.name}>{playlist.name}</span>
                        <span className={styles.details}>{`${playlist.songIds === null ? '0' : playlist.songIds.length} Songs`}</span>
                    </div>
                </div>
            );
        });
    }
    else if(!userLoggedIn) {
        content = <span className={styles.authText}>Please login <Link to={{ 
            pathname: '/auth', 
            state: { comingFrom: window.location.pathname } 
          }} className={styles.here}> here </Link> to see your playlists</span>
    }

    return (
        <React.Fragment>
        {(flashMsg !== null ? <Flash msg={flashMsg} destroy={() => setFlashMsg(null)} /> : null)}
        <div className={`${styles.container} ${loading || !loading && !userLoggedIn ? styles.loading : ''}`}>
            <span className={styles.title}>Your Playlists</span>
            {content}
        </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        isPlaying: state.audioPlaying
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setPlay: (play) => dispatch({type: "SET_PLAY", play: play})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary(AddToPlaylist));