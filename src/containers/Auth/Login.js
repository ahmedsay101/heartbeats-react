import React, {Component} from 'react';
import axios from '../../axios';
import {Link} from 'react-router-dom';
import { withRouter } from "react-router";
import styles from './Auth.module.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import logo from '../../assets/logo.svg';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

class Login extends Component {
    state = {
        form: {
            email: {
                style: "input1",
                msg: "",
                attrs: {
                    type: "email",
                    name: "email",
                    placeholder: "Email",
                    autoComplete: "off",
                    value: ""
                },
                validation: {
                    required: true
                },
                touched: false,
                isValid: false
            },
            password: {
                style: "input1",
                msg: "",
                attrs: {
                    type: "password",
                    name: "password",
                    placeholder: "Password",
                    autoComplete: "off",
                    value: ""
                },
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 30
                },
                isValid: false,
                touched: false
            }      
        },
        canSubmit: false,
        loading: false
    }

    componentDidMount() {
        if(this.props.location.state) {
            if(this.props.location.state.guest) {
                this.setState({
                    form: {
                        ...this.state.form,
                        email: {
                            ...this.state.form.email,
                            attrs: {
                                ...this.state.form.email.attrs, 
                                value: 'guest@heartbeats.com'
                            }
                        },
                        password: {
                            ...this.state.form.password,
                            attrs: {
                                ...this.state.form.password.attrs, 
                                value: '123456789'
                            }
                        }
                    }
                });
            }
        }
    }

    checkValidity(value, rules) {
        let isValid = true;
        let msg = "";
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
            if(!isValid) {
                msg = "This input can't be empty";
                return {
                    isValid: isValid,
                    msg: msg
                }
            }
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
            if(!isValid) {
                msg = "Please enter a value longer than " + rules.minLength + " characters";
                return {
                    isValid: isValid,
                    msg: msg
                }
            }
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
            if(!isValid) {
                msg = "Please enter a value less than " + rules.maxLength + " characters";
                return {
                    isValid: isValid,
                    msg: msg
                }
            }
        }

        return {
            isValid: isValid,
            msg: msg
        }
    }

    inputChangeHandler = (event, input) => {
        const newForm = {
            ...this.state.form
        }
        const newInput = {
            ...newForm[input]
        }
        const newInputAttrs = {
            ...newInput.attrs
        }
        newInputAttrs.value = event.target.value;

        newInput.isValid = this.checkValidity(newInputAttrs.value, newInput.validation).isValid;
        newInput.msg = this.checkValidity(newInputAttrs.value, newInput.validation).msg;
        newInput.touched = true;
        
        let formIsValid = true;
        for (let input in newForm) {
            formIsValid = newForm[input].isValid && formIsValid;
        }

        newInput.attrs = newInputAttrs;
        newForm[input] = newInput;
        this.setState({form: newForm, canSubmit: formIsValid});
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const body = {};
        for(let el in this.state.form) {
            body[el] = this.state.form[el].attrs.value;
        }
        const jsonData = JSON.stringify(body); 
        axios({
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            url: "sessions",
            data: jsonData
        })
        .then(response => {
            if(response.status === 200) {
                this.setState({loading: false});
                localStorage.setItem('sessId', response.data.data.session.sessId);
                localStorage.setItem('userId', response.data.data.session.userId);
                localStorage.setItem('accessToken', response.data.data.session.accessToken);
                if(this.props.location.state.comingFrom) {
                    this.props.history.push(this.props.location.state.comingFrom);
                }
                else {
                    this.props.history.push("/");
                }
            }
        }).catch(err => {
            this.setState({loading: false});
        });
    }

    render() {
        const formElements = [];
        for(let key in this.state.form) {
            formElements.push({
                id: key,
                data: this.state.form[key]
            });
        }
        return (
            <div className={styles.mainContainer}>
                <div className={styles.authContainer}>
                    <div className={styles.header}>
                        <Link to='/'><img src={logo} className={styles.logo}/></Link>
                        <h1 className={styles.mainText}>Login to continue</h1>
                    </div>
                    <form className={styles.form} onSubmit={this.submitHandler}>
                        {formElements.map(el => (
                            <Input
                                key={el.id} 
                                shape={el.data.style}
                                touched={el.data.touched}  
                                valid={el.data.isValid} 
                                msg={el.data.msg} 
                                attrs={el.data.attrs} 
                                change={(event) => this.inputChangeHandler(event, el.id)}
                            />
                        ))}
                        <div className={styles.btnContainer}>
                            <Button shape='button1' loading={this.state.loading} spinner="buttonSpinner">Login</Button>
                            <Link className={styles.link} to="/register">
                                <span className={styles.switchText}>New to heartbeats? Register here!</span>
                            </Link>
                        </div> 
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(ErrorBoundary(Login));