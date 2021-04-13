import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Playlist from '../Playlist/Playlist';
import Slider from '../Slider/Slider';
import Spinner from '../../components/Spinner/Spinner';

const Profile = () => {
    let recentSongs;

    const [recentlyPlayed, setRecentlyPlayed] = useState(null); 
    const [artists, setArtists] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const promises = [
            axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/plays`}),
            axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/artists`})
        ]
        Promise.all(promises).then(res => {
            console.log(res[0]);
            if(res[0].status === 200 && res[1].status === 200 || res[1].status === 204) {
                setRecentlyPlayed(res[0].data.data.songs);
                recentSongs = res[0].data.data.songs;
                if(res[1].status === 204) setArtists(null);
                if(res[1].status === 200) setArtists(res[1].data.data);
                setLoading(false);
                window.addEventListener('like', onLikeHandler);
            }
        }).catch(err => {
            console.log(err.response);
        });

    }, []);

    const onLikeHandler = e => {
        if(recentSongs.map(song => song.id).includes(e.detail.id)) {
            const newSongs = recentSongs.map(song => {
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
            setRecentlyPlayed(newSongs);
            recentSongs = newSongs;
        }
    }

    let content;
    if(loading) {
        content = <Spinner shape='buttonSpinner' />;
    }      
    else {
        content = <React.Fragment>
                    <Playlist title='Recently Played' songsArray={recentlyPlayed} options={[{
                        text: 'Add to playlist',
                        todo: 'ADD_TO_PLAYLIST'
                    },
                    {
                        text: 'Play next',
                        todo: 'PLAY_NEXT'
                    }]} />
                    {(artists !== null ? <Slider itemLength="4" itemType="artist" title="Artists You Followed" items={artists} /> : null)} 
                </React.Fragment>;
    }
    return (
        <div className={(loading ? 'flexCenter' : '')} style={{minHeight: '200px'}}>
            {content}
        </div>
    );
}
export default Profile;