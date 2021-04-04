import React from "react";
import styles from "./VolumeBar.module.css";

function VolumeBar(props) {
    return (
        <div className={styles.volumeBarContainer} ref={props.containerRef}>
            <div className={styles.insideVolumeBar}>
                <div className={styles.volumeBar} ref={props.barRef} onMouseDown={props.mouseDown}>
                    <div className={styles.volumeBarProgress} style={{"height": props.height}}>
                        <div className={styles.volumeBarBall}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VolumeBar;
