import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import styles from './Header.module.css';

import SearchBar from '../../components/SearchBar/SearchBar';
import SearchResults from '../../components/SearchResults/SearchResults';
import UserStatus from '../../components/UserStatus/UserStatus';

import logo from '../../assets/widelogo.svg';

class Header extends Component {
    constructor(props) {
        super(props);
        this.searchContainer = React.createRef();
    }

    state = {
        searchResults: [],
        shouldResultsAppear: false,
        searching: false
    }

    componentDidMount() {
        document.addEventListener('mousedown', event => {
            if(this.searchContainer && this.searchContainer.current) {
                if(!this.searchContainer.current.contains(event.target)) {
                    this.setState({shouldResultsAppear: false});
                }
            }
        });
    }

    onSearch = (e) => {
        if(e.target.value.trim() === "") {
            this.setState({shouldResultsAppear: false});
            return;
        }
        this.setState({searching: true});
        axios({
            method: "GET",
            url: "search/" + e.target.value,
        })
        .then(response => {
            console.log(response);
            this.setState({searchResults: response.data.data,
                shouldResultsAppear: true,
                searching: false
            });
        })
        .catch(err => {
            console.log(err);
            if(err.response.status === 404) {
                this.setState({
                    searchResults: [],
                    shouldResultsAppear: true,
                    searching: false
                });
            }
        });
    }

    resultsAppear = (e) => {
        if(e.target.value.trim() === "") return;
        this.setState({shouldResultsAppear: true});
    }

    render() {
        return (
            <div className={styles.header}>
                <Link className={styles.logoContainer} to="/"><img src={logo} className={styles.logo} /></Link>
                <div className={styles.middle}>
                    <div className={styles.glSearch} ref={this.searchContainer}>

                        <SearchBar 
                        shouldResultsAppear={this.state.shouldResultsAppear} 
                        searching={this.searching} 
                        keyup={this.onSearch} 
                        focus={this.resultsAppear}/>

                        <SearchResults shouldResultsAppear={this.state.shouldResultsAppear} searchResults={this.state.searchResults} />

                    </div>
                </div>
                <UserStatus />
            </div>
        );
    }
}

export default Header;