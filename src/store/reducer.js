const iniState = {
    audioPlaying: false,
    currentSong: {},
    currentPlaylist: [],
    currentPlaylistSongs: [],
    currentIndex: null,
    showQueue: false,
    fetchingSong: true,
    userShouldUpdate: false,
    playingFromUploads: false,
    shuffle: false,
    flashMessage: null,
    fetchingSongError: null,
    error: null,
    showMenu: window.innerWidth >= 1250 ? true : false
}

const reducer = (state = iniState, action) => {
    switch(action.type) {
        case "SHOW_QUEUE": 
            return {
                ...state,
                showQueue: action.show
            }
        case "SET_PLAYING":
            return {
                ...state,
                audioPlaying: action.play
            }
        case "SET_CURRENT_SONG": 
            return {
                ...state,
                currentSong: action.songData,
                currentPlaylist: action.playlist,
                audioPlaying: action.play,
                currentIndex: action.index,
                fetchingSong: action.fetchingSong,
                playingFromUploads: action.playingFromUploads,
                shuffle: action.shuffle
            }
        case "SET_CURRENT_PLAYLIST": 
            return {
                ...state,
                currentPlaylist: action.playlist     
            }
        case "SET_FETCHING_SONG": 
            return {
                ...state,
                fetchingSong: action.fetching
            }
        case "SET_FETCHING_SONG_ERROR": 
            return {
                ...state,
                fetchingSongError: action.error
            }
        case "CHANGE_LIKE": 
            return {
                ...state,
                currentSong: {
                    ...state.currentSong,
                    isLiked: action.like
                }
            }
        case "SET_VOLUME": 
            return {
                ...state,
                volume: action.volume,
                mute: (action.volume === 0 ? true : false)
            }
        case "SET_ERROR": 
            return {
                ...state,
                error: action.error
            }
        case "SHOW_MENU": 
            return {
                ...state,
                showMenu: action.show
            }
        default: 
            return state;
    }
}
export default reducer;