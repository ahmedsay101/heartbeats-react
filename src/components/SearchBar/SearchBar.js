import React, {useEffect, useState} from 'react';
import styles from './SearchBar.module.css';
import Button from '../Button/Button';
import searchIcon from '../../assets/search.svg';
import cancel from '../../assets/cancel.svg';

const SearchBar = props => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', () => {
            setWindowWidth(window.innerWidth);
        });
    }, []);

    const attrs = {
        type: "text",
        name: "search",
        autoComplete: "off",
        placeholder: "Search for Artists, Songs"
    }

    let content;

    if(windowWidth >= 800) {
        content = <div className={styles.searchContainer}>
                    <input className={styles.searchBar + " " + (props.shouldResultsAppear ? styles.noBottomRadius : "")} {...attrs} onKeyUp={props.keyup} onFocus={props.focus}/>
                    <Button shape={"search"} loading={props.searching} spinner="searchSpinner" otherClasses={(props.shouldResultsAppear ? styles.noBottomRadius : "")}>
                        <img src={searchIcon} className={styles.sic}/>
                    </Button>
                </div>;
    } else if (windowWidth < 800) {
        content = <div className={styles.mobSearchContainer} style={{display: props.show ? 'flex' : 'none'}}>
            <input className={styles.mobSearchBar} {...attrs} onKeyUp={props.keyup} onFocus={props.focus}/>
            <button className={styles.searchCancel} onClick={props.onCancel}><img src={cancel} className={styles.xicon} /></button>
        </div>
    }

    return (content);
}
export default SearchBar;