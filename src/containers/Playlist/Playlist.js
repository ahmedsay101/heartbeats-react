import React, {useState} from 'react';
import styles from './Playlist.module.css';
import PlaylistSong from '../../components/PlaylistSong/PlaylistSong';


function Playlist(props) {
    let title = (props.title ? <div className={styles.header}><span className='sec_title'>{props.title}</span></div> : null);
    let songs = null;

    if(props.songsArray) {
        const playlist = props.songsArray.map(song => song.id);
        
        songs = props.songsArray.map(song => {
            return (
                <PlaylistSong key={Math.random()*11} data={song} playlist={playlist} deleteFromPlaylist={(props.deleteFromPlaylist ? props.deleteFromPlaylist : null)} options={props.options}/>
            );
        });
    }
    
    const loadingTemp = Array.apply(null, { length: 5 }).map((e, i) => (
        <React.Fragment key={i}>
            <div className={styles.loadingTemp}>
                <div className={styles.loadingData}>
                    <div className={styles.loadingImg}></div>
                    <div className={styles.loadingName}></div>
                </div>
                <div className={styles.loadingArtist}></div>
            </div>
        </React.Fragment>
    ));

    return (
        <div className={styles.playlist}>
            {title}
            {(props.loading ? loadingTemp : songs)}
        </div>
    );
}
export default Playlist;