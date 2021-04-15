import React, { Component } from 'react';
import styles from './ErrorBoundary.module.css';
import warning from '../../assets/warning.svg';
import Floating from '../../containers/Floating/Floating';
import axios from '../../axios.js';
import { connect } from 'react-redux';

class Error extends Component {
    state = {
        error: null
    }

    componentWillMount () {
        axios.interceptors.request.use(req => {
            this.props.setError(null);
            return req;
        });
        axios.interceptors.response.use(res => res, error => {
            if(error.response) {
                this.props.setError(error.response.data.msg);
            }
            else {
                this.props.setError(error.message);
            }
        });
    }

    componentWillReceiveProps(props) {
        if(props.error !== this.state.error) {
            this.setState({error: props.error});
        }
    }

    render () {
        return (
            <React.Fragment>
                {(this.state.error !== null ? <Floating open={true} destroy={() => this.props.setError(null)}>
                    <div className={styles.error}>
                        <div className={styles.header}>
                            <img className={styles.icon} src={warning} />
                            <span className={styles.title}>Error</span>
                        </div>
                        <div className={styles.container}>
                            <span className={styles.msg}>{this.state.error}</span>
                        </div>
                        <div className={styles.container}>
                            <button className={styles.errorBtn} onClick={() => this.props.setError(null)}>Ok</button>
                        </div>
                    </div>
                </Floating> : null )}
                {this.props.children}     
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.error
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setError: (err) => dispatch({type: "SET_ERROR", error: err})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Error);