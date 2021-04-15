import React, {Component} from 'react';
import Error from './Error';
const ErrorBoundary = ( WrappedComponent ) => {
    return class extends Component {
        render() {
            return (
                <Error>
                    <WrappedComponent {...this.props}/>
                </Error>
            );
        }

    }
}
export default ErrorBoundary;

