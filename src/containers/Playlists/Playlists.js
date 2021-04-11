import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Route, Link} from 'react-router-dom';
import styles from './Playlists.module.css';

import Button from '../../components/Button/Button';
import Floating from '../Floating/Floating';
import UserPlaylist from '../../components/UserPlaylist/UserPlaylist';
import CreatePlaylist from '../../components/CreatePlaylist/CreatePlaylist';

const Playlists = props => {

    const [loading, setLoading] = useState(true);
    const [playlists, setPlaylists] = useState(null);

    useEffect(() => {
        axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/playlists`}).then(response => {
            console.log(response);
            setLoading(false);
            if(response.status === 200) {
                setPlaylists(response.data.data);
            }
        }).catch(err => {
            console.log(err);
            setLoading(false);
        });
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
                const newPlaylists = [...playlists];
                newPlaylists.unshift(res.data.data);
                setPlaylists(newPlaylists);
                setOpen(false);
            }
        }).catch(err => console.log(err.response));
    }
 
    let content;
    if(!loading && playlists === null) {
        content = <span className={styles.noUploads}>You don't have uploads, Click Create Playlist</span>
    }
    else if(!loading && playlists){
        content = playlists.map(playlist => {
            return (
                <UserPlaylist key={playlist.id} data={playlist} />
            );
        });
    }

    return (
        <React.Fragment>
            {( open ? <Floating open={open} close={openCreate}><CreatePlaylist submit={submit} loading={loading}/></Floating> : null)}
            <div className={styles.playlists}>
                <div className={styles.header}>
                    <span className={styles.mainText}>Your Playlists</span>
                    <button className={styles.button} onClick={(o) => openCreate(!open)}>Create Playlist</button>
                </div>
                <div className={styles.content}>
                    {content}
                </div>
            </div>
        </React.Fragment>
    );
}
export default Playlists;