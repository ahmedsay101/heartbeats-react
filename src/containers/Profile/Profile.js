import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Playlist from '../Playlist/Playlist';
import Slider from '../Slider/Slider';
import Spinner from '../../components/Spinner/Spinner';
import Flash from '../../components/Flash/Flash';

const Profile = props => {
    let recentSongs;

    const [recentlyPlayed, setRecentlyPlayed] = useState(null); 
    const [artists, setArtists] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [flashMsg, setFlash] = useState(null);

    useEffect(() => {
        if(props.location.state) {
            if(props.location.state.comingFrom === '/profile/edit') {
                setFlash('Your data has changed');
            }
            else if(props.location.state.comingFrom === '/passwords') {
                setFlash('Your password is successfully reset');
            }
        }
        const promises = [
            axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/plays`}),
            axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/artists`})
        ]
        Promise.all(promises).then(res => {
            if(res[0].status === 200 && res[1].status === 200 || res[1].status === 204) {
                const recentlyPlayedWithoutUploads = res[0].data.data.songs.filter(song => !song.fromUploads);
                setRecentlyPlayed(recentlyPlayedWithoutUploads.map(song => song.song));
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
        <React.Fragment>
            {(flashMsg !== null ? <Flash msg={flashMsg} destroy={() => setFlash(null)} /> : null)}
            <div className={(loading ? 'flexCenter' : '')} style={{minHeight: '200px'}}>
                {content}
            </div>
        </React.Fragment>
    );
}
export default Profile;