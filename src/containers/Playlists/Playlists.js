import React, {useState, useEffect} from 'react';
import axios from 'axios';

import styles from './Playlists.module.css';

import Floating from '../Floating/Floating';
import UserPlaylist from '../../components/UserPlaylist/UserPlaylist';
import CreatePlaylist from '../../components/CreatePlaylist/CreatePlaylist';
import Flash from '../../components/Flash/Flash';

import {deletePlaylist} from '../../commonActions';

const Playlists = props => {

    const [loading, setLoading] = useState(true);
    const [playlists, setPlaylists] = useState(null);
    const [flashMsg, setFlash] = useState(null);

    useEffect(() => {
        let mounted = true;
        if(props.location.state) {
            if(props.location.state.comingFromDeleted && mounted) {
                setFlash("Your Playlist Is Gone");
            }
        }
        axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/playlists`}).then(response => {
            if(mounted) { 
                setLoading(false);
                if(response.status === 200 ) {
                    setPlaylists(response.data.data);
                }
            }
        }).catch(err => {
            if(mounted) setLoading(false);
        });
        return () => {
            mounted = false;
        }
    }, []);

    const [open, setOpen] = useState(false);

    const openCreate = (todo) => {
        setOpen(todo);
    }

    const submit = (name) => {
        const data = JSON.stringify({
            name: name
        });
        axios({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            url: 'playlists',
            data: data
        }).then(res => {
            console.log(res);
            if(res.status === 201) {
                if(playlists === null) {
                    setPlaylists([res.data.data]);
                }
                else {
                    const newPlaylists = [...playlists];
                    newPlaylists.unshift(res.data.data);
                    setPlaylists(newPlaylists);
                    setOpen(false);
                }
            }
        }).catch(err => console.log(err.response));
    }

    const deletePlaylistHandler = async(id) => {
        const deletePromise = await deletePlaylist(id);
        if(deletePromise) {
            const newPlaylists = playlists.filter( playlist => playlist.id != id );
            if(newPlaylists.length === 0) {
                setPlaylists(null);
            }
            else {
                setPlaylists(newPlaylists);
            }
            setFlash('Your playlist is gone');
        }
    }

    const playlistOptions = [{
        text: 'Delete',
        todo: 'DELETE_PLAYLIST'
    }];
 
    let content;
    if(!loading && playlists === null) {
        content = <span className={styles.noPlaylists}>You don't have playlists, Click Create Playlist</span>
    }
    else if(!loading && playlists){
        content = playlists.map(playlist => {
            return (
                <UserPlaylist key={playlist.id} data={playlist} playlistOptions={playlistOptions} onDelete={deletePlaylistHandler} />
            );
        });
    }

    return (
        <React.Fragment>
            {(flashMsg !== null ? <Flash msg={flashMsg} destroy={() => setFlash(null)} /> : null)}
            {( open ? <Floating open={open} destroy={() => setOpen(false)}><CreatePlaylist submit={submit} loading={loading} destroy={() => setOpen(false)} /></Floating> : null)}
            <div className={styles.playlists}>
                <div className={styles.header}>
                    <span className={styles.mainText}>Your Playlists</span>
                    <button className={styles.button} onClick={() => setOpen(true)}>Create Playlist</button>
                </div>
                <div className={styles.content} style={{minWidth: !loading && playlists === null ? '200px' : 'auto'}}>
                    {content}
                </div>
            </div>
        </React.Fragment>
    );
}
export default Playlists;