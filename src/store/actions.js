import axios from 'axios';

export const setNewSong = (play) => {
    console.log(play.shuffle);
    return (dispatch, getState) => {
        if(getState().currentSong.id === play.id && getState.playingFromUploads === play.uploads) return;
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






