import React, {Component} from 'react';
import axios from '../../axios';
import {Link} from 'react-router-dom';
import styles from './Artists.module.css';
import Spinner from '../../components/Spinner/Spinner';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

class Artists extends Component {
    state = {
        loading: true,
        artists: []
    }
    componentDidMount() {
        axios({
            method: "GET",
            url: "artists"
        })
        .then(res => {
            if(res.status === 200) {
                this.setState({
                    loading: false,
                    artists: res.data.data
                });
            }
        })
        .catch(err => console.log(err));
    }
    render() {        
        let content;
        if(this.state.loading) {
            content = <Spinner shape="buttonSpinner" />;
        }
        else {
            content = this.state.artists.map(artist => {
                return (
                    <Link replace key={Math.random()*11} className={styles.container + " link"} to={`/artist/${artist.id}`}>
                        <div className={styles.imgHolder} style={{backgroundImage: "url("+artist.imgUrl+")"}}></div>
                        <span className={styles.name}>{artist.name}</span>
                    </Link>
                );
            });
        }

        return (
            <div className={"contentContainer"+" "+(this.state.loading ? styles.loading : "")}>
                <div className={styles.mainContainer+" "+(this.state.loading ? styles.loading : "")}>{content}</div>
            </div>
        );
    }
}
export default ErrorBoundary(Artists);