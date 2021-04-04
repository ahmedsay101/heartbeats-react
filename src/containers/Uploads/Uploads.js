import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Route, Link} from 'react-router-dom';
import styles from './Uploads.module.css';

import UploadedSong from '../../components/UploadedSong/UploadedSong';

import Button from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';

import add from '../../assets/add.svg';

const Uploads = props => {
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [songs, setSongs] = useState(null);

    useEffect(() => {
        axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/uploads`}).then(res => {
            console.log(res);
            setLoading(false);
            if(res.status === 200) {
                setSongs(res.data.data);
            }
            else if (res.status === 404) {
                setSongs(null);
            }
        }).catch(err => {
            console.log(err.response);
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
            const newSongs = [...songs];
            newSongs.unshift(response.data.data);
            setSongs(newSongs);
        }).catch(err => {
            setUploading(false);
            console.log(err.response);
        });
    };

    const onSelectFile = (event) => uploadSong(event.target.files[0]);

    let content;
    if(!loading && songs === null) {
        content = <span className={styles.noUploads}>You don't have uploads, Click browse files to upload a song</span>
    }
    else if(!loading && songs){
        content = songs.map(song => {
            return (
                <UploadedSong key={Math.random()*11} data={song} />
            );
        });
    }

    return (
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
            <div className={styles.content}>
                {content}
            </div>
        </div>
    );
}
export default Uploads;