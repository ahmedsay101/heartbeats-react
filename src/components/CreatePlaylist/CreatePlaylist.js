import React, {useState} from 'react';
import styles from './CreatePlaylist.module.css';
import Button from '../Button/Button';
import { checkValidity } from '../../commonActions';

const CreatePlaylist = props => {
    const validation = {
        required: true,
        minLength: 2,
        maxLength: 25
    }

    const [name, setName] = useState({
        value: '',
        error: false,
        errorMsg: ''
    });

    const nameChange = (event, validation) => {
        setName({
            value: event.target.value,
            error: !checkValidity(event.target.value, validation).isValid,
            errorMsg: checkValidity(event.target.value, validation).msg
        });
    }

    const submit = () => {
        if(!name.error) {
            props.submit(name.value);
            props.destroy();
        }
    }
    return(
        <div className={styles.upload}>
            <div className={styles.header}><span className={styles.mainText}>Create A New Playlist</span></div>
            <div className={styles.inputContainer}>
                <span className={styles.errorMsg}>{name.errorMsg}</span>
                <input onChange={(event) => nameChange(event, validation)} type={"text"} className={`${styles.input} ${name.error ? styles.error : ''}`} name='playlistName' autoComplete='off' placeholder='Playlist Name' />
            </div>
            <div className={styles.footer}><Button shape='button1' spinner='buttonSpinner' loading={props.loading} click={submit}>Create</Button></div>
        </div>
    );
}
export default CreatePlaylist;