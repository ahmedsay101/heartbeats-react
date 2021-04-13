import React, {useRef} from 'react';
import styles from './SearchResults.module.css';
import SearchSong from '../SearchSong/SearchSong';
import SearchArtist from '../SearchArtist/SearchArtist';

function SearchResults(props) {
    let searchResults;
    const container = useRef(null);

    if(props.searchResults.length === 0) {
        searchResults = <div className={"result flexCenter"+ " " + styles.noHover}>No Results Found</div>;
    }
    else {
        searchResults = props.searchResults.map(el => {
            if(el.type.toLowerCase() === "song") {
                return (
                    <SearchSong key={el.id+Math.random()} songData={el} searchResultsLength={props.searchResultsLength} parent={container.current}/>
                );
            }
            else if(el.type.toLowerCase() === "artist") {
                return (
                    <SearchArtist key={el.id+Math.random()} artistData={el} searchResultsLength={props.searchResultsLength}/>
                );
            }
        });
    }
    return (
        <div className={styles.searchResults + " " + (!props.shouldResultsAppear ? styles.hide : "")} ref={container}>
            {searchResults}
        </div>

    );
}
export default SearchResults;