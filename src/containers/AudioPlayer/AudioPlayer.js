import React, { Component } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import axios from 'axios';
import styles from './AudioPlayer.module.css';
import SongData from '../../components/SongData/SongData';
import AudioControls from '../../components/AudioControls/AudioControls';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import AudioOptions from '../../components/AudioOptions/AudioOptions';
import VolumeBar from '../../components/VolumeBar/VolumeBar';
import Queue from '../Queue/Queue';
import { randomNum, changeLike, authStorageExist, calculateOptionsPosition } from '../../commonActions';
import { setNewSong } from '../../store/actions';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import Button from '../../components/Button/Button';
import Options from '../../components/Options/Options';
import playIcon from '../../assets/play.svg';
import pauseIcon from '../../assets/pause.svg';
import optionsIcon from '../../assets/options.svg';
import Floating from '../Floating/Floating';

class AudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.audio = React.createRef();
        this.progressBar = React.createRef();
        this.volumeBarContainer = React.createRef();
        this.volumeBar = React.createRef();
        this.volumeButton = React.createRef();
        this.queue = React.createRef();
        this.queueButton = React.createRef();
        this.optionsBtn = React.createRef();
    }

    state = {
        shuffle: false,
        repeat: false,
        progressBarMouseDown: false,
        volumeBarMouseDown: false,
        progressBarWidth: 0,
        duration: 0.00,
        currentTime: 0.00,
        remaining: 0.00,
        loading: true,
        fetchingSong: true,
        newTime: 0,
        lastPlayed: [], 
        volume: (localStorage.getItem("volume") !== null ? localStorage.getItem("volume") : window.innerWidth <=600 ? 1 : 0.8),
        mute: (parseFloat(localStorage.getItem("volume")) === 0 ? true : false),
        started: false,
        currentSong: {},
        isLiked: null,
        playing: null,
        currentIndex: 0,
        queueShown: false,
        playingFromUploads: null,
        mobOptions: false,
        mobOptionsPosition: null,
        mobVolumeBar: false,
        mobQueue: false,
        windowSize: window.innerWidth
    }

    componentDidMount() {
        if(this.audio && this.audio.current) {
            if(authStorageExist()) {
                axios({method: 'GET', url: `users/${localStorage.getItem('userId')}/plays`}).then(res => {
                    if(res.status === 200) {
                        this.setNew({
                            id: res.data.data.songs[0].song.id, 
                            playlist: res.data.data.playlist, 
                            play: false,
                            uploads: res.data.data.songs[0].fromUploads
                        });
                    }
                }).catch(err => {
                    this.playRandomSong();
                });
            }
            else {
                this.playRandomSong();
            }
            this.audio.current.addEventListener("canplay", () => {
                if(this.state.playing) {
                    this.play();
                }

                this.setVolume(this.state.volume);

                this.setState({
                    loading: false,
                    duration: this.formatTime(this.getDuration()),
                    currentTime: this.formatTime(this.getCurrentTime()),
                    remaining: this.formatTime(this.getDuration() - this.getCurrentTime()),
                });
            });

            this.audio.current.addEventListener("waiting", () => {
                this.setState({loading: true});
            });

            this.audio.current.addEventListener("play", () => {
                this.setState({
                    loading: false,
                    started: true,
                    playing: true
                });
                this.props.setPlay(true);
            });

            this.audio.current.addEventListener("pause", () => {
                this.setState({
                    loading: false,
                    playing: false
                });
                this.props.setPlay(false);
            });

            this.audio.current.addEventListener("ended", () => {
                const incPlaysPromises = [
                    axios({                
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    method: 'POST', 
                    url: 'artists/plays',
                    data: JSON.stringify({artistId: this.state.currentSong.artistId})
                    }),
                    axios({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }, 
                    method: 'POST', 
                    url: 'albums/plays',
                    data: JSON.stringify({albumId: this.state.currentSong.albumId})
                })]
                Promise.all(incPlaysPromises); 
                
                if(this.state.repeat) {
                    this.setTime(0);
                    this.play();
                }
                this.nextSong();
            });

            this.audio.current.addEventListener("timeupdate", () => {
                this.setState({
                    remaining: this.formatTime(this.getDuration() - this.getCurrentTime()),
                    currentTime: this.formatTime(this.getCurrentTime())
                });

                if(!this.state.progressBarMouseDown) {
                    this.setState({ 
                        progressBarWidth: (this.getCurrentTime() / this.getDuration() * 100) + "%"
                    });  
                } 
    
                if(this.getDuration() - this.getCurrentTime() < 7) {
                    const timeLeft = this.getDuration() - this.getCurrentTime();
                    const volume = this.getVolume() / 7; 
                    const newVolume = volume * timeLeft;
                    this.audio.current.volume = newVolume;
                }
            });
        }

        document.addEventListener('mousedown', event => {
            if(this.queue && this.queue.current && this.queueButton && this.queueButton.current) {

                if(!this.queue.current.contains(event.target) && !this.queueButton.current.contains(event.target)) {
                    this.props.showQueue(false);
                }

            }
        });

        document.addEventListener('mouseover', event => {
            if(this.volumeBarContainer && this.volumeBarContainer.current && this.volumeButton && this.volumeButton.current && window.innerWidth >= 800) {
                if(this.volumeBarContainer.current.contains(event.target) || this.volumeButton.current.contains(event.target)) {
                    $(this.volumeBarContainer.current).css({"display": "block"});
                    this.showVolumeBar(localStorage.getItem("volume"));
                }
                else {
                    $(this.volumeBarContainer.current).css({"display": "none"});
                }
            }
        });

        document.addEventListener('mousemove', e => {
            if(this.progressBar && this.progressBar.current) {
                if(this.state.progressBarMouseDown) {
                    this.changeProgress(e);
                    $("body").css({ "user-select" : "none" });
                }
            }
            if(this.volumeBarContainer && this.volumeBarContainer.current) {
                if(!this.volumeBarContainer.current.contains(e.target) && this.state.volumeBarMouseDown) {
                    this.setState({volumeBarMouseDown: false});
                }
                if(this.state.volumeBarMouseDown) {
                    this.volumeChange(e);
                    $("body").css({ "user-select" : "none" });
                }
            }
        });

        document.addEventListener('mouseup', e => {
            if(this.state.progressBarMouseDown) {
                this.setTime(this.state.newTime);
                this.setState({progressBarMouseDown: false});
                $("body").css({ "user-select" : "auto" });
            }
            if(this.state.volumeBarMouseDown) {
                this.setState({volumeBarMouseDown: false});
                $("body").css({ "user-select" : "auto" });
            }
        });

        window.addEventListener('like', e => {
            if(e.detail.id == this.state.currentSong.id) {
                this.setState({isLiked: e.detail.like});
            }
        });

        window.addEventListener('resize', () => {
            this.setState({windowSize: window.innerWidth});
        });
    }

    componentWillReceiveProps(props) {
        if(props.currentSong !== this.state.currentSong || props.currentIndex !== this.state.currentIndex) {
            this.setState({
                currentSong: props.currentSong,
                currentIndex: props.currentIndex,
                isLiked: props.currentSong.isLiked
            });
            if(this.audio && this.audio.current) {
                this.audio.current.src = props.currentSong.url;
            }
        }


        if(props.shuffle !== this.state.shuffle) {
            this.setState({shuffle: props.shuffle});
        }
    
        if(props.play !== this.state.playing) {
            this.setState({playing: props.play});
            if(props.play) {
                this.play();
            }
            else if(!props.play) {
                this.pause();
            }
        }
        if(props.queue !== this.state.queueShown) {
            this.setState({queueShown: props.queue});
        }
        if(props.playingFromUploads !== this.state.playingFromUploads) {
            this.setState({playingFromUploads: props.playingFromUploads});
        }
          
    }

    componentWillUnmount() {
        this.pause();
    }

    playRandomSong = () => {
        axios({
            method: "GET",
            url: "songs/random"
        })
        .then(response => {
            if(response.status === 200) {
                this.setNew({
                    id: response.data.data.songId, 
                    playlist: response.data.data.playlist, 
                    play: false,
                    uploads: false
                });
            }
        }).catch(err => {
            this.setState({loading: false});
        });
    }

    getDuration = () => {
        if(this.audio && this.audio.current) {
            return this.audio.current.duration;
        }
    }
    getCurrentTime = () => {
        if(this.audio && this.audio.current) {
            return this.audio.current.currentTime;
        }
    }

    formatTime(secs) {
        const time = Math.round(secs);
        const minutes = Math.floor(time / 60);
        const seconds = time - (minutes * 60);

        const zero = (seconds < 10) ? "0" : "";
    
        return `${minutes}:${zero}${seconds}`;
    }

    getVolume = () => {
        return this.audio.current.volume;
    }

    setTime = (time) => {
        this.audio.current.currentTime = time;
    }

    playHandler = () => {
        if(this.state.playing) {
            this.pause();
        }
        else if(!this.state.playing) {
            this.play();
        }
    }

    play = () => {
        this.setState({loading: true});
        const playPromise = this.audio.current.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                this.setState({
                    loading: false,
                    started: true,
                    playing: true
                });
                this.props.setPlay(true);
            })
            .catch(error => {
                this.props.setPlay(false);
            });
        }
    }
    pause = () => {
        this.audio.current.pause();
        this.setState({
            loading: false,
            playing: false
        });
        this.props.setPlay(false);
    }

    showQueue = () => {
        this.props.showQueue(!this.props.queue);
        let scrolled;
        if(this.state.currentIndex === 0) {
            scrolled = 10;
        }
        else {
            scrolled = (this.state.currentIndex * 60) + 10;
        }
        $(this.queue.current).animate({scrollTop: scrolled}, 200);
    }

    shuffleHandler = () => {
        if(this.state.shuffle) {
            this.setState({shuffle: false});
        }
        else if(!this.state.shuffle) {
            this.setState({shuffle: true});
        }
    }

    repeatHandler = () => {
        if(this.state.repeat) {
            this.setState({repeat: false});
        }
        else if(!this.state.repeat) {
            this.setState({repeat: true});
        }
    }

    setNew = (data) => {
        if(this.state.currentSong.id == data.id && data.uploads === this.state.playingFromUploads) return;
        this.setState({started: false});
        this.props.setTrack(data);
    }

    likeHandler = async () => {
        if(this.state.playingFromUploads) return;
        if(!authStorageExist()) return;
        const likePromise = await changeLike(this.state.currentSong.id, this.state.isLiked);
    }

    nextSong = () => {
        let index = this.props.currentIndex;
        if(this.state.repeat) {
            this.setTime(0);
            return;
        }
        else if(this.state.shuffle) {
            index = randomNum(0, this.props.currentPlaylist.length - 1);
            if (index == this.props.currentIndex) {
                index = randomNum(0, this.props.currentPlaylist.length - 1);
            }
            const lastPlayed = this.state.lastPlayed.concat(index);
            this.setState({lastPlayed: lastPlayed});
        }
        else {
            if(this.props.currentIndex == this.props.currentPlaylist.length - 1) {
                index = 0;
            }
            else {
                index++;
            }
        }
        this.setNew({
            id: this.props.currentPlaylist[index], 
            playlist: this.props.currentPlaylist, 
            play: true,
            uploads: this.state.playingFromUploads,
            shuffle: this.state.shuffle
        });
    }
    
    previousSong = () => {
        let index = this.props.currentIndex;

        if (this.state.repeat || this.getCurrentTime() <=3 && !this.state.started) {
            this.setTime(0);
            return;
        }
        else if (this.props.currentIndex == 0 && !this.state.shuffle) {
            this.setTime(0);
            return;
        }
        else if (this.state.shuffle) {
            if (this.state.lastPlayed.length > 1) {
                const lastPlayed = this.state.lastPlayed.slice(0, -1);
                this.setState({lastPlayed: lastPlayed})
                index = this.state.lastPlayed[this.state.lastPlayed.length -1];
            }
            else if (this.state.lastPlayed.length == 1) {
                this.setState({lastPlayed: []});
                if(this.props.currentIndex == 0) {
                    this.setTime(0);
                }
                else {
                    index--;
                }
            }
        }
        else {	
            index--;
        }       
        this.setNew({
            id: this.props.currentPlaylist[index], 
            playlist: this.props.currentPlaylist, 
            play: true,
            uploads: this.state.playingFromUploads,
            shuffle: this.state.shuffle
        });
    }

    showVolumeBar = () => {
        if(this.volumeButton && this.volumeButton.current && window.innerWidth >= 800) {
            const docTop = $(document).scrollTop();
            const buttonTopDoc = $(this.volumeButton.current).offset().top;
            const containerHeight = $(this.volumeBarContainer.current).height();
            const containerTop = buttonTopDoc - docTop - containerHeight;
            const containerLeft = $(this.volumeButton.current).offset().left;
            $(this.volumeBarContainer.current).css({"top": containerTop + "px", "left": containerLeft -10 + "px"});
            this.setVolume(localStorage.getItem("volume"));
        }
    }

    onVolumeButtonClick = () => {
        if(this.state.mute || this.state.volume == 0) {
            this.setVolume(0.2);
        }
        else {
            this.setVolume(0);
        }
    }

    onVolumeBarMouseDown = e => {
        this.setState({volumeBarMouseDown: true});
        this.volumeChange(e);
    }

    setVolume = (vol) => {
        this.setState({
            volume: vol,
            volumeBarHeight: vol * $(this.volumeBar.current).height() + "px",
            mute: (vol == 0 ? true : false)
        });
        if(this.audio && this.audio.current) {
            this.audio.current.volume = vol; 
        }
        localStorage.setItem("volume", vol);
    }

    volumeChange = (e) => {
        const documentTop = $(document).scrollTop();
        const barTop = $(this.volumeBar.current).offset().top;
        const top = barTop - documentTop;

        const barHeight = $(this.volumeBar.current).height();
        const maxHeight = top + barHeight;

        const newHeight = e.clientY - top;
        let reqHeight = Math.abs(newHeight - barHeight);

        if(reqHeight >= barHeight) {
            reqHeight = barHeight;
        }
        else if(e.clientY >= maxHeight) {
            reqHeight = 0;
        }
        const audioPercentage = reqHeight / barHeight;

        this.setVolume(audioPercentage);
    }

    changeProgress = (e) => {
        const progressBarWidth = $(this.progressBar.current).width();
        const left = $(this.progressBar.current).offset().left;
        let width;

        width = e.clientX - left;

        if(width >= progressBarWidth) {
            width = progressBarWidth;
        }
        else if(width <= 0) {
            width = 0;
        }

        const percentage = width / progressBarWidth * 100;

        const newTime = this.getDuration() * (percentage / 100);
        this.setState({
            progressBarWidth: width + "px",
            newTime: newTime
        });
    }

    onProgressBarMouseDown = (e) => {
        this.setState({progressBarMouseDown: true});
        this.changeProgress(e);
    }

    mobOptionsOnClick = () => {
        this.setState(prevState => ({
            mobOptionsPosition: calculateOptionsPosition(this.optionsBtn.current, 3, true),
            mobOptions: !prevState.mobOptions
        }));
    }

    render() {
        if(this.state.windowSize < 800) {

            let mobOptions = [
            {
                text: 'Sound',
                todo: () => this.setState({mobVolumeBar: true})
            },
            {
                text: `Queue`,
                todo: () => this.setState({mobQueue: true})
            }]

            if(authStorageExist()) {
                mobOptions = [{
                    text: `${this.state.isLiked ? 'Dislike' : 'Like'}`,
                    todo: this.likeHandler
                }, ...mobOptions]
            }

            return (
                <div className={styles.mobAudioPlayer}>
                    {(this.state.mobVolumeBar ? 
                    <Floating open={this.state.mobVolumeBar} destroy={() => this.setState({mobVolumeBar: false})}>
                        <VolumeBar
                        mouseDown={this.onVolumeBarMouseDown}
                        containerRef={this.volumeBarContainer}
                        barRef={this.volumeBar}
                        height={this.state.volumeBarHeight}
                        />
                    </Floating> : null)}
                    {(this.state.mobQueue ? 
                    <Floating open={this.state.mobQueue} destroy={() => this.setState({mobQueue: false})}>
                        <Queue 
                        queueRef={this.queue}
                        next={this.nextSong}
                        previous={this.previousSong}
                        onPlay={this.playHandler}
                        onShuffle={this.shuffleHandler}
                        onRepeat={this.repeatHandler}
                        repeat={this.state.repeat}
                        shuffle={this.state.shuffle}
                        play={this.state.playing}
                        show={true}
                        />
                    </Floating> : null)}
                    {(this.state.mobOptions ? <Options position={this.state.mobOptionsPosition} options={mobOptions} destroy={() => this.setState({mobOptions: false})} /> : null)}
                    <audio className={styles.hidden} type="audio/mp3" ref={this.audio}/>
                    <ProgressBar 
                        duration={this.state.duration}
                        currentTime={this.state.currentTime}
                        remaining={this.state.remaining}
                        mouseDown={this.onProgressBarMouseDown}
                        progressBarRef={this.progressBar}
                        width={this.state.progressBarWidth}
                    />
                    <div className={styles.mobAudioPlayerData}>
                        <SongData currentSong={this.state.currentSong} loading={this.props.fetchingSong} uploads={this.state.playingFromUploads} />
                        <Button shape="play" click={this.playHandler} spinner="buttonSpinner" loading={this.state.loading}>
                            {(this.state.playing ? <img src={pauseIcon} className={styles.mobPlayIcon} /> :
                            <img src={playIcon} className={styles.mobPlayIcon} /> )}
                        </Button>
                        <Button shape="queueOptions" click={this.mobOptionsOnClick} forwardedRef={this.optionsBtn}>
                            <img src={optionsIcon} className={styles.mobOptionsIcon} />
                        </Button>
                    </div>
                </div>
            );
        }
        else if (this.state.windowSize >= 800) {
            return (
                <div className={styles.audioContainer}>
                    <Queue queueRef={this.queue} />
                    <audio className={styles.hidden} type="audio/mp3" ref={this.audio}/>
                    <SongData currentSong={this.state.currentSong} loading={this.props.fetchingSong} uploads={this.state.playingFromUploads} />
                    <div className={styles.audioControls}>
                        <AudioControls 
                        onPlay={this.playHandler}
                        onShuffle={this.shuffleHandler}
                        onRepeat={this.repeatHandler}
                        repeat={this.state.repeat}
                        shuffle={this.state.shuffle}
                        play={this.state.playing}
                        next={this.nextSong}
                        previous={this.previousSong}
                        loading={this.state.loading}
                        />
                        <ProgressBar 
                        duration={this.state.duration}
                        currentTime={this.state.currentTime}
                        remaining={this.state.remaining}
                        mouseDown={this.onProgressBarMouseDown}
                        progressBarRef={this.progressBar}
                        width={this.state.progressBarWidth}
                        />
                    </div>
                    <AudioOptions 
                    onLike={this.likeHandler} 
                    onQueue={this.showQueue} 
                    onVolume={this.onVolumeButtonClick}
                    volume={this.state.volume}
                    mute={this.state.mute}
                    isLiked={this.state.isLiked}
                    queueButtonRef={this.queueButton}
                    volumeButtonRef={this.volumeButton}
                    authenticated={authStorageExist}
                    />
                    <VolumeBar
                    mouseDown={this.onVolumeBarMouseDown}
                    containerRef={this.volumeBarContainer}
                    barRef={this.volumeBar}
                    height={this.state.volumeBarHeight}
                    />
                </div>
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        play: state.audioPlaying,
        currentSong: state.currentSong,
        currentPlaylist: state.currentPlaylist,
        currentPlaylistSongs: state.currentPlaylistSongs,
        currentIndex: state.currentIndex,
        queue: state.showQueue,
        fetchingSong: state.fetchingSong,
        playingFromUploads: state.playingFromUploads,
        shuffle: state.shuffle
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setTrack: (data) => dispatch(setNewSong(data)),
        setPlay: (play) => dispatch({type: "SET_PLAYING", play: play}),
        showQueue: (show) => dispatch({type: "SHOW_QUEUE", show: show}),
        changeLike: (like) => dispatch({type: "CHANGE_LIKE", like: like}),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary(AudioPlayer));

