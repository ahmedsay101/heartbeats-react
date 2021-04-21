import React, {useEffect, useState} from 'react';
import axios from '../../axios';
import {useHistory} from 'react-router-dom';
import styles from './EditProfile.module.css';
import Button from '../../components/Button/Button';
import { checkValidity } from '../../commonActions';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

const EditProfile = props => {
    const history = useHistory();

    const firstNameValidation = {
        required: true,
        minLength: 2,
        maxLength: 25
    }

    const lastNameValidation = {
        required: true,
        minLength: 2,
        maxLength: 25
    }

    const emailValidation = {required: true}

    const [firstName, setFirstName] = useState({});
    const [lastName, setLastName] = useState({});
    const [email, setEmail] = useState({});

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let mounted = true;
        axios({method: 'GET', url: `users/${localStorage.getItem('userId')}`}).then(res => {
            if(mounted) {
                setFirstName({value: res.data.data.firstName, error: false, errorMsg:''});
                setLastName({value: res.data.data.lastName, error: false, errorMsg:''});
                setEmail({value: res.data.data.email, error: false, errorMsg:''});
                setLoading(false);
            }
        }).catch(err => console.log(err));
        return () => {
            mounted = false;
        }
    }, []);

    const changeHandler = (event, validation, setState) => {
        setState({
            value: event.target.value,
            error: !checkValidity(event.target.value, validation).isValid,
            errorMsg: checkValidity(event.target.value, validation).msg
        });

    }

    const submit = () => {
        if(!firstName.error && !lastName.error && !email.error ) {
            const jsonData = JSON.stringify({
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
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
					const updateEvent = new CustomEvent('userShouldUpdate');
					window.dispatchEvent(updateEvent);
                    history.push({
                        pathname: '/profile',
                        state: {
                            comingFrom: '/profile/edit'
                        }
                    });
                }
            }).catch(err => {
                setSubmitting(false);
            });
        }
        else {
            return;
        }
    }

    const loadingTemp = Array.apply(null, { length: 3 }).map((e, i) => (
        <React.Fragment key={i}>
            <div className={styles.inputGp}>
                <div className={styles.loadingLabel} />
                <div className={styles.loadingUser} />
            </div>
        </React.Fragment>
    ));

    if(loading) {
        return loadingTemp;
    }
    else {
        return (
            <div className={styles.EditProfile}>
                <div className={styles.inputGp}>
                    <div className={styles.inputHeader}>
                        <label htmlFor='firstName' className={styles.userLabel}>First Name</label>
                        <span className={styles.errorMsg}>{firstName.errorMsg}</span>
                    </div>
                    <input onChange={(event) => changeHandler(event, firstNameValidation, setFirstName)} className={`${styles.user} ${firstName.error ? styles.error : ''}`} type='text' name='firstName' value={firstName.value} autoComplete='off'/>
                </div>

                <div className={styles.inputGp}>
                    <div className={styles.inputHeader}>
                        <label htmlFor='lastName' className={styles.userLabel}>Last Name</label>
                        <span className={styles.errorMsg}>{lastName.errorMsg}</span>
                    </div>
                    <input onChange={(event) => changeHandler(event, lastNameValidation, setLastName)} className={`${styles.user} ${lastName.error ? styles.error : ''}`} type='text' name='lastName' value={lastName.value} autoComplete='off'/>
                </div>

                <div className={styles.inputGp}>
                    <div className={styles.inputHeader}>
                        <label htmlFor='email' className={styles.userLabel}>Email</label>
                        <span className={styles.errorMsg}>{email.errorMsg}</span>
                    </div>
                    <input onChange={(event) => changeHandler(event, emailValidation, setEmail)} className={`${styles.user} ${email.error ? styles.error : ''}`} type='email' name='email' value={email.value} autoComplete='off'/>
                </div>
                <div className={styles.formFooter}>
                    <Button spinner='buttonSpinner' shape='button1' click={submit} loading={submitting}>Submit</Button>
                </div>
            </div>
        );

    }
}

export default ErrorBoundary(EditProfile);