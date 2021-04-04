import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Route, Link} from 'react-router-dom';
import styles from './Profile.module.css';

import Playlist from '../Playlist/Playlist';
import Slider from '../Slider/Slider';
import Spinner from '../../components/Spinner/Spinner';

const Profile = () => {
    const [recentlyPlayed, setRecentlyPlayed] = useState(null); 
    const [artists, setArtists] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const promises = [
            axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/plays`}),
            axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/artists`})
        ]
        Promise.all(promises).then(res => {
            if(res[0].status === 200 && res[1].status === 200 || res[1].status === 404) {
                setRecentlyPlayed(res[0].data.data.songs);
                if(res[1].status === 404) setArtists(null);
                if(res[1].status === 200) setArtists(res[1].data.data);
                setLoading(false);
            }
        }).catch(err => {
            console.log(err);
        });

    }, []);

    let content;
    if(loading) {
        content = <Spinner shape='buttonSpinner' />;
    }      
    else {
        content = <React.Fragment>
                    <Playlist title='Recently Played' songsArray={recentlyPlayed} />
                    {(artists !== null ? <Slider itemLength="4" itemType="artist" title="Artists You Followed" items={artists} /> : null)} 
                </React.Fragment>;
    }
    return (content);
}
export default Profile;