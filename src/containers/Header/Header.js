import React, {Component} from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import styles from './Header.module.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchResults from '../../components/SearchResults/SearchResults';
import UserStatus from '../../components/UserStatus/UserStatus';
import menu from "../../assets/menu.svg";
import logo from '../../assets/widelogo.svg';
import lightSearch from '../../assets/lightSearch.svg';

class Header extends Component {
    constructor(props) {
        super(props);
        this.searchContainer = React.createRef();
    }

    state = {
        searchResults: [],
        shouldResultsAppear: false,
        searching: false,
        mobShow: false,
        windowWidth: window.innerWidth
    }

    componentDidMount() {
        document.addEventListener('mousedown', event => {
            if(this.searchContainer && this.searchContainer.current) {
                if(!this.searchContainer.current.contains(event.target)) {
                    this.setState({
                        shouldResultsAppear: false,
                        mobShow: false
                    });
                }
            }
        });
        window.addEventListener('like', this.onLikeHandler);
        window.addEventListener('resize', () => {
            this.setState({windowWidth: window.innerWidth});
        });
    }

    onLikeHandler = e => {
        if(this.state.searchResults.length < 1) return;
        const songs = this.state.searchResults.filter(item => item.type.toLowerCase() === 'song').map(song => song.id);
        if(songs.includes(e.detail.id)) {
            const newResults = this.state.searchResults.map(result => {
                if(result.type.toLowerCase() === 'song') {
                    if(result.id == e.detail.id) {
                        return {
                            ...result,
                            isLiked: e.detail.like
                        }
                    }
                    else {
                        return result;
                    }
                }
                else {
                    return result;
                }
            });
            this.setState({searchResults: newResults});
        }
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
            this.setState({searchResults: response.data.data,
                shouldResultsAppear: true,
                searching: false
            });
        })
        .catch(err => {
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
                <div className={styles.logoSec}>
                    <button className={styles.menuButton} onClick={() => this.props.setShow(!this.props.show)}><img src={menu} className={styles.bars} /></button>
                    <Link className={styles.logoContainer} to="/"><img src={logo} className={styles.logo} /></Link>
                </div>
                <div className={styles.middle}>
                    <div className={styles.glSearch} ref={this.searchContainer}>

                        <SearchBar 
                        shouldResultsAppear={this.state.shouldResultsAppear} 
                        searching={this.searching} 
                        keyup={this.onSearch} 
                        focus={this.resultsAppear}
                        onCancel={() => this.setState({
                            shouldResultsAppear: false,
                            mobShow: false
                        })}
                        show={this.state.mobShow} />
                        {( this.state.windowWidth < 800 ? <div className={styles.searchBtnContainer}>
                        <button className={styles.mobSearchButton} onClick={() => this.setState({mobShow: true})}>
                            <img src={lightSearch} className={styles.searchIcon} />
                        </button></div> : null )}

                        <SearchResults shouldResultsAppear={this.state.shouldResultsAppear} searchResults={this.state.searchResults} />

                    </div>
                </div>
                <UserStatus />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        show: state.showMenu
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setShow: (show) => dispatch({type: 'SHOW_MENU', show: show})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);