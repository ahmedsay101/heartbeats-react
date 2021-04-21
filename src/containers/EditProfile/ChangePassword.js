import React, {useState} from 'react';
import axios from '../../axios';
import {useHistory} from 'react-router-dom';
import styles from './EditProfile.module.css';
import Button from '../../components/Button/Button';
import { checkValidity, logout } from '../../commonActions';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

const ChangePassword = props => {
    const history = useHistory();
    const validation = {                    
        required: true,
        minLength: 5,
        maxLength: 30
    }
    const [oldPassword, setOldPassword] = useState({
        value: '',
        error: false,
        errorMsg: ''
    });
    const [newPassword, setNewPassword] = useState({
        value: '',
        error: false,
        errorMsg: ''
    });

    const [submitting, setSubmitting] = useState(false);

    const onSuccess = () => {
        history.push({
            pathname: '/profile', 
            state: {
                comingFrom: '/passwords'
            } 
        });
    }

    const changeHandler = (event, validation, setState) => {
        setState({
            value: event.target.value,
            error: !checkValidity(event.target.value, validation).isValid,
            errorMsg: checkValidity(event.target.value, validation).msg
        });
    }

    const submit = () => {
        if(!oldPassword.error && !newPassword.error) {
            const jsonData = JSON.stringify({
                oldPassword: oldPassword.value,
                newPassword: newPassword.value
            });
            setSubmitting(true);
            axios({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'PATCH',
                url: `users/${localStorage.getItem('userId')}`,
                data: jsonData
            }).then(res => {
                setSubmitting(false);
                if(res.status === 200) {
                    onSuccess();
                }
            
            }).catch(err => {
                setSubmitting(false);
            });
        }
        else {
            return;
        }
    }

    return (
        <div className={styles.EditProfile}>
            <div className={styles.inputGp}>
                <div className={styles.inputHeader}>
                    <label htmlFor='oldPassword' className={styles.userLabel}>Your Old Password</label>
                    <span className={styles.errorMsg}>{oldPassword.errorMsg}</span>
                </div>
                <input onChange={(event) => changeHandler(event, validation, setOldPassword)} className={`${styles.user} ${oldPassword.error ? styles.error : ''}`} type='password' name='oldPassword' value={oldPassword.value} autoComplete='off' placeholder='Old Password'/>
            </div>

            <div className={styles.inputGp}>
                <div className={styles.inputHeader}>
                    <label htmlFor='newPassword' className={styles.userLabel}>New Password</label>
                    <span className={styles.errorMsg}>{newPassword.errorMsg}</span>
                </div>
                <input onChange={(event) => changeHandler(event, validation, setNewPassword)} className={`${styles.user} ${newPassword.error ? styles.error : ''}`} type='password' name='newPassword' value={newPassword.value} autoComplete='off' placeholder='New Password'/>
            </div>

            <div className={styles.formFooter}>
                <Button spinner='buttonSpinner' shape='button1' click={submit} loading={submitting}>Submit</Button>
            </div>
        </div>
    );
}

export default ErrorBoundary(ChangePassword);