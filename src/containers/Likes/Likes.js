import React, {useEffect, useState} from 'react';
import axios from '../../axios';
import Playlist from '../Playlist/Playlist';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

const Likes = () => {
    let likesArray;
    const [likes, setLikes] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/likes`}).then(res => {
            likesArray = res.data.data;
            setLikes(res.data.data);
            setLoading(false);
            window.addEventListener("like", onLike);
        }).catch(err => {
            console.log(err);
        });
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
            setLikes(newLikes);
            likesArray = newLikes;
        }
    }
     
    return ( <Playlist title='Likes' songsArray={likes} loading={loading} options={[{
        text: 'Add to playlist',
        todo: 'ADD_TO_PLAYLIST'
    },
    {
        text: 'Play next',
        todo: 'PLAY_NEXT'
    }]} /> );
}
export default ErrorBoundary(Likes);