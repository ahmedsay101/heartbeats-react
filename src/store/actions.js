import axios from '../axios';
import {authStorageExist} from '../commonActions';

export const setNewSong = (play) => {
    return (dispatch, getState) => {
        if(getState().currentSong.id === play.id && getState.playingFromUploads === play.uploads) return;

        let differentPlaylist = getState().currentPlaylist !== play.playlist;
        dispatch(setFetchingSong(true));
        axios({
            method: "GET",
            url: play.uploads ? `users/${localStorage.getItem('userId')}/uploads/${play.id}` : `songs/${play.id}`
        })
        .then(response => {
            const songData = response.data.data;
            dispatch(setTrack({
                songData: songData,
                playlist: play.playlist,
                play: play.play,
                uploads: play.hasOwnProperty('uploads') ? play.uploads : false,
                shuffle: play.hasOwnProperty('shuffle') ? play.shuffle : false
            }));

            if(authStorageExist()) {
                axios({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    method: 'POST', 
                    url: `users/${localStorage.getItem('userId')}/plays`,
                    data: JSON.stringify({id: play.id, uploads: play.hasOwnProperty('uploads') ? play.uploads : false})
                }).then(res => {
                    console.log(res);
                })
                .catch(err => console.log(err));
            
                if(differentPlaylist) {
                    axios({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        method: 'PATCH', 
                        url: `users/${localStorage.getItem('userId')}`,
                        data: JSON.stringify({lastPlaylist: play.playlist})
                    })
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => console.log(err));
                }
            }
        })
        .catch(err => {
            console.log(err.response);
        });
    }
}
export const setFetchingSong = (fetching) => {
    return {
        type: "SET_FETCHING_SONG", 
        fetching: fetching
    }
}

export const pushError = (err) => {
    return {
        type: "SET_ERROR", 
        error: err,
    }
}

export const setTrack = (play) => {
    return {
        type: "SET_CURRENT_SONG", 
        fetchingSong: false,
        songData: play.songData, 
        playlist: play.playlist, 
        play: play.play, 
        index: play.playlist.indexOf(play.songData.id),
        playingFromUploads: play.uploads,
        shuffle: play.shuffle
    }
}

export const playNext = (id) => {
    return (dispatch, getState) => {
        if(getState().playingFromUploads || getState().currentSong.id == id ||getState().currentPlaylist[getState().currentIndex + 1] == id) return;
        const playlist = [...getState().currentPlaylist];
        playlist.splice(getState().currentIndex + 1, 0, id);

        dispatch({
            type: "SET_CURRENT_PLAYLIST",
            playlist: playlist
        });
    }
}






