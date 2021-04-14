import React, { Component } from 'react';
import styles from './ErrorBoundary.module.css';
import warning from '../../assets/warning.svg';
import Floating from '../../containers/Floating/Floating';


const ErrorBoundary = ( WrappedComponent, axios ) => {
    return class extends Component {
        state = {
            error: null
        }

        componentWillMount () {
            axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });
            axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render () {
            return (
                <React.Fragment>
                    {(this.state.error !== null ? <Floating open={true} destroy={() => this.setState({error: null})}>
                        <div className={styles.error}>
                            <div className={styles.header}>
                                <img className={styles.icon} src={warning} />
                                <span className={styles.title}>Error</span>
                            </div>
                            <div className={styles.container}>
                                <span className={styles.msg}>{this.state.error.response.data.msg}</span>
                            </div>
                            <div className={styles.container}>
                                <button className={styles.errorBtn} onClick={this.errorConfirmedHandler}>Ok</button>
                            </div>
                        </div>
                    </Floating> : null )}
                    <WrappedComponent {...this.props} />
                </React.Fragment>
            );
        }
    }
}

export default ErrorBoundary;
