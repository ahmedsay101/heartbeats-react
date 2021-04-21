import React, {useState, useRef} from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './UserPlaylist.module.css';
import Button from '../Button/Button';
import Options from '../Options/Options';
import Confirmation from '../Confirmation/Confirmation';
import Floating from '../../containers/Floating/Floating';
import optionsIcon from '../../assets/options.svg';
import {setNewSong} from '../../store/actions';
import {calculateOptionsPosition} from '../../commonActions';

const UserPlaylist = props => {
    const history = useHistory();

    const [showOptions, setShowOptions] = useState(false);
    const [optionsPosition, setOptionsPosition] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const optionsBtn = useRef(null);

    const nav = e => {
        if(e.target.id === 'notClickable' || e.target.classList.contains('notClickable')) return;
        history.push(`playlist/${props.data.id}`);
    }

    const optionsClickHandler = () => {
        if(props.playlistOptions) {
            setOptionsPosition(calculateOptionsPosition(optionsBtn.current, props.playlistOptions.length, true));
            setShowOptions(!showOptions);
        }
    }

    const optionsFunctions = {
        'DELETE_PLAYLIST': () => setDeleteConfirmation(`Are you sure, you want to delete ${props.data.name}`)
    };

    let generatedOptions = null;

    if(props.playlistOptions) {
        generatedOptions = props.playlistOptions.map(option => {
            return {
                text: option.text,
                todo: optionsFunctions[option.todo]
            }
        });
    }
    
    return (
        <React.Fragment>
        {(showOptions ? <Options position={optionsPosition} options={generatedOptions} destroy={() => setShowOptions(false)} /> : null)}
        {( deleteConfirmation !== null ? <Floating open={true} destroy={() => setDeleteConfirmation(null)}><Confirmation msg={deleteConfirmation} confirm={() => props.onDelete(props.data.id)} destroy={() => setDeleteConfirmation(null)}/></Floating> : null)}
        <div className={styles.playlist} onClick={nav}>
            <div className={styles.playlistData}>
                <div className={`${styles.img} ${props.data.songIds === null ? styles.noSongsImg : ''}`} style={{backgroundImage: `url(${props.data.imgUrl})`}}></div>
                <span className={styles.playlistName}>{props.data.name}</span>
            </div>
            <span className={styles.sec}>{`${(props.data.songIds !== null && props.data.songIds.length > 0 ? props.data.songIds.length : 'No')} Songs`}</span>
            <div className={styles.options}>
                <Button shape="queueOptions" id='notClickable' forwardedRef={optionsBtn} click={optionsClickHandler}>
                    <img  src={optionsIcon} className={`${styles.icon} notClickable`} />
                </Button>
            </div>
        </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        isPlaying: state.audioPlaying,
        currentSong: state.currentSong,
        currentIndex: state.currentIndex,
        currentPlaylist: state.currentPlaylist,
        playingFromUploads: state.playingFromUploads,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setTrack: (data) => dispatch(setNewSong(data)),
        setPlay: (play) => dispatch({type: "SET_PLAYING", play: play})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserPlaylist);