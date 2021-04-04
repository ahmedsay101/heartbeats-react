import React from 'react';
import styles from './SearchBar.module.css';

import Button from '../Button/Button';
import searchIcon from '../../assets/search.svg';

function SearchBar(props) {
    const attrs = {
        type: "text",
        name: "search",
        autoComplete: "off",
        placeholder: "Search for Artists, Songs"
    }
    return (
        <div className={styles.searchContainer}>
            <input className={styles.searchBar + " " + (props.shouldResultsAppear ? styles.noBottomRadius : "")} {...attrs} onKeyUp={props.keyup} onFocus={props.focus}/>
            <Button shape={"search"} loading={props.searching} spinner="searchSpinner" otherClasses={(props.shouldResultsAppear ? styles.noBottomRadius : "")}>
                <img src={searchIcon} className={styles.sic}/>
            </Button>
        </div>
    );
}
export default SearchBar;