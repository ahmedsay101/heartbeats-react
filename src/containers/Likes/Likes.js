import React, {useEffect, useState} from 'react';
import axios from '../../axios';
import styles from './Likes.module.css';
import Playlist from '../Playlist/Playlist';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

const Likes = () => {
    let likesArray;
    const [likes, setLikes] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/likes`}).then(res => {
            if(res.data.data.length === 0) {
                if(mounted) setLikes(null);
            }
            else {
                if(mounted) setLikes(res.data.data);
            }
            likesArray = res.data.data;
            if(mounted) setLoading(false);
            window.addEventListener("like", onLike);
        }).catch(err => {
            console.log(err);
        });

        return () => {
            mounted = false;
            window.removeEventListener("like", onLike);
        } 
    }, []);

    const onLike = (e) => {
        if(e.detail.like) {
            const newLikes = [...likesArray];
            axios({method: 'GET', url: `songs/${e.detail.id}`}).then(res => {
                newLikes.unshift(res.data.data);
                setLikes(newLikes);
                likesArray = newLikes;
            }).catch(err => console.log(err));
        }
        else if(!e.detail.like) {
            const newLikes = likesArray.filter(song => song.id != e.detail.id);
            if(newLikes.length === 0) {
                setLikes(null);
            }
            else {
                setLikes(newLikes);
            }
            likesArray = newLikes;
        }
    }

    if(likes === null && !loading) {
        return (
            <span className={styles.noLikes}>You haven't liked any songs yet</span>
        );
    }
    else {
        return ( <Playlist title='Likes' songsArray={likes} loading={loading} options={[{
            text: 'Add to playlist',
            todo: 'ADD_TO_PLAYLIST'
        },
        {
            text: 'Play next',
            todo: 'PLAY_NEXT'
        }]} /> );
    }
}
export default ErrorBoundary(Likes);