import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { connect} from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './AddToPlaylist.module.css';

import Spinner from '../Spinner/Spinner';
import Flash from '../Flash/Flash';


import { isAuthenticated } from '../../commonActions';


const AddToPlaylist = props => {
    const [playlists, setPlaylists] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [flashMsg, setFlashMsg] = useState(null);

    useEffect(() => {
        init();
    }, []);

    const init = async() => {

        const authenticated = await isAuthenticated();
        if(authenticated) {
            setUserLoggedIn(true);
            axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/playlists`}).then(res => {
                setLoading(false);
                if(res.status === 200) {
                    setPlaylists(res.data.data);
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(err.response);
            });
        }
        else {
            setUserLoggedIn(false);
            setLoading(false);
        }
    
    }

    const add = playlist => {
        if(playlist.songIds !== null) {
            if(playlist.songIds.includes(props.songId)) {
                alert("This playlist already has this song");
                return;
            }
        }
        const newPlaylist = playlist.songIds === null ? [props.songId] : [...playlist.songIds, props.songId];
        axios({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'PATCH', 
            url: `playlists/${playlist.id}`,
            data: JSON.stringify({songIds: newPlaylist})
        }).then(res => {
            if(res.status === 200) {
                setFlashMsg("Done!");
                const newPlaylists = playlists.map(item => {
                    console.log(item.id);
                    console.log(playlist.id);
                    if(item.id == playlist.id) {
                        return {
                            ...item, 
                            songIds: newPlaylist
                        }
                    }
                    else {
                        return item;
                    }
                });
                setPlaylists(newPlaylists);        
            }
        }).catch(err => console.log(err));
    }

    let content;
    if(loading) {
        content = <Spinner shape='buttonSpinner' />;
    }
    else if (!loading && playlists !== null && userLoggedIn){
        content = playlists.map(playlist => {
            return (
                <div key={playlist.id} className={styles.playlist} onClick={() => add(playlist)}>
                    <div className={styles.img} style={{backgroundImage: `url(${playlist.imgUrl})`}} />
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
        {(flashMsg !== null ? <Flash msg={flashMsg} setMsg={setFlashMsg} /> : null)}
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
        setMsg: (msg) => dispatch({type: "SET_FLASH", msg: msg})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddToPlaylist);