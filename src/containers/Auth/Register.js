import React, {Component} from 'react';
import axios from '../../axios';
import {Link} from 'react-router-dom';
import { withRouter } from "react-router";
import styles from './Auth.module.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import logo from '../../assets/logo.svg';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

class Register extends Component {
    state = {
        form: {
            firstName: {
                style: "input1",
                msg: "",
                attrs: {
                    type: "text",
                    name: "firstName",
                    placeholder: "First Name",
                    autoComplete: "off",
                    value: ""
                },
                validation: {
                    required: true,
                    minLength: 2,
                    maxLength: 25
                },
                touched: false,
                isValid: false
            },
            lastName: {
                style: "input1",
                msg: "",
                attrs: {
                    type: "text",
                    name: "lastName",
                    placeholder: "Last Name",
                    autoComplete: "off",
                    value: ""
                },
                validation: {
                    required: true,
                    minLength: 2,
                    maxLength: 25
                },
                isValid: false,
                touched: false
            },
            email: {
                style: "input1",
                msg: "",
                attrs: {
                    type: "email",
                    name: "email",
                    placeholder: "Your email",
                    autoComplete: "off",
                    value: ""
                },
                validation: {
                    required: true,
                },
                isValid: false,
                touched: false
            },
            password: {
                style: "input1",
                msg: "",
                attrs: {
                    type: "password",
                    name: "password",
                    placeholder: "Your password",
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
        if( this.state.canSubmit ) {
            event.preventDefault();
            this.setState({loading: true});
            const body = {};
            for(let el in this.state.form) {
                body[el] = this.state.form[el].attrs.value;
            }
            const jsonData = JSON.stringify(body); 

            console.log(jsonData);
            axios({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: "POST",
                url: "users",
                data: jsonData
            })
            .then(response => {
                console.log(response);
                if(response.status === 201) {
                    this.setState({loading: false});
                    localStorage.setItem('sessId', response.data.data.session.sessId);
                    localStorage.setItem('userId', response.data.data.session.userId);
                    localStorage.setItem('accessToken', response.data.data.session.accessToken);
                    this.props.history.push("/");
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({loading: false});
            });
        }
        else {
            event.preventDefault();
            alert("Please, Fill All Required Fields!");
        }
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
                        <h1 className={styles.mainText}>Create a new account</h1>
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
                            <Button shape='button1' spinner="buttonSpinner" loading={this.state.loading}>Register</Button>
                            <Link className={styles.link} to="/auth">
                                <span className={styles.switchText}>Already have an account? Login here!</span>
                            </Link>
                        </div> 
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(ErrorBoundary(Register));