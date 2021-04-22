import React, {Component} from 'react';
import styles from './Slider.module.css';
import { connect } from 'react-redux';

import SliderSong from '../../components/SliderSong/SliderSong';
import SliderAlbum from '../../components/SliderAlbum/SliderAlbum';
import SliderArtist from '../../components/SliderArtist/SliderArtist';

import $ from 'jquery';

import Button from '../../components/Button/Button';
import rightArrow from '../../assets/rightArrow.svg';
import leftArrow from '../../assets/leftArrow.svg';

class Slider extends Component {
    constructor(props) {      
        super(props);
        this.container = React.createRef();
        this.element = React.createRef();
        this.nextButton = React.createRef();
        this.backButton = React.createRef();
        this.start = true;
        this.animationSpeed = 250;
        this.mouseDown = false;
        this.mounted = true;
    }

    state = {
        containerWidth: null,
        containerHeight: null,
        width: null,
        itemWidth: null,
        itemHeight: null,
        isSlider: false,
        showMenu: null
    }

    componentDidMount() {
        this.mounted = true;
        if(this.container && this.container.current && this.element && this.element.current) {
            this.calculate();
        }
        document.addEventListener("mouseover", this.onMouseOver);
        document.addEventListener("mousedown", this.mouseDownHandler);
        document.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("mouseup", this.mouseUp);
        window.addEventListener('resize', this.calculate); 
    }

    componentWillUnmount() {
        this.mounted = false;
        document.removeEventListener("mouseover", this.onMouseOver);
        document.removeEventListener("mousedown", this.mouseDownHandler);
        document.removeEventListener("mousemove", this.mouseMove);
        document.removeEventListener("mouseup", this.mouseUp);
        window.removeEventListener('resize', this.calculate);
    }

    componentWillReceiveProps(props) {
        if(props.showMenu !== this.state.showMenu) {
            this.setState({
                showMenu: props.showMenu,
            });
            this.calculate();
            this.start = false;
            $(this.element.current).animate({left: '0px'}, this.animationSpeed, () => {
                this.start = true;
            });
        }
    }

    calculate = () => {
        let numOfItems;
        switch(this.props.itemType.toLowerCase()) {
            case 'song': 
                if($(this.container.current).width() >= 1200) {
                    numOfItems = 6;
                }
                else if($(this.container.current).width() > 1000 && $(this.container.current).width() < 1200) {
                    numOfItems = 5;
                }
                else if($(this.container.current).width() < 1000 && $(this.container.current).width() > 750) {
                    numOfItems = 4;
                }
                else if($(this.container.current).width() < 750 && $(this.container.current).width() > 550) {
                    numOfItems = 3;
                }
                else {
                    numOfItems = 2;
                }
                break;
            case 'album':
                if($(this.container.current).width() >= 1200) {
                    numOfItems = 4;
                }
                else if($(this.container.current).width() > 1000 && $(this.container.current).width() < 1200) {
                    numOfItems = 3;
                }
                else if($(this.container.current).width() < 1000 && $(this.container.current).width() > 650) {
                    numOfItems = 2;
                }
                else if($(this.container.current).width() < 650) {
                    numOfItems = 1;
                }
                break;
            case 'artist': 
                if($(this.container.current).width() >= 1200) {
                    numOfItems = 6;
                }
                else if($(this.container.current).width() > 1000 && $(this.container.current).width() < 1200) {
                    numOfItems = 5;
                }
                else if($(this.container.current).width() < 1000 && $(this.container.current).width() > 750) {
                    numOfItems = 4;
                }
                else if(window.innerWidth < 750 && window.innerWidth > 550) {
                    numOfItems = 3;
                }
                else {
                    numOfItems = 2;
                }
                break;
        }
        this.setState({
            containerWidth: $(this.container.current).width(),
            width: $(this.element.current).width(),
            itemWidth: $(this.container.current).width() / numOfItems,
            itemHeight: $(this.element.current).find(">:first-child").outerHeight(),
            isSlider: ($(this.element.current).children().length * $(this.container.current).width() / numOfItems) > $(this.container.current).width()
        });
    }

    onMouseOver = e => {
        if(window.innerWidth < 800) return;
        if(this.container && this.container.current && this.nextButton && this.nextButton.current && this.backButton && this.backButton.current) {
            if(this.container.current.contains(e.target) || this.nextButton.current.contains(e.target) || this.backButton.current.contains(e.target)) {
                [this.nextButton.current, this.backButton.current].forEach(el => {
                    if(this.state.isSlider) {
                        $(el).css({"display": "flex"});
                    }
                });
            }
            else {
                [this.nextButton.current, this.backButton.current].forEach(el => {
                    if(this.state.isSlider) {
                        $(el).css({"display": "none"});
                    }
                });
            }
        }
    }

    moveLeft = () => {
        if(!this.start) return;
        const currentLeft = parseInt($(this.element.current).css('left'));
        const currentRight = parseInt($(this.element.current).css('right'));
        let movement = this.state.containerWidth;

        if (currentRight > -this.state.containerWidth && currentRight < 0) {
            movement = -currentRight;
        }

        if (currentRight === 0) {
            this.start = false;
            $(this.element.current).animate({left: currentLeft - 150 + "px"}, this.animationSpeed, () => {
                $(this.element.current).animate({left: currentLeft + "px"}, 50, () => {
                    $(this.element.current).css({"right": "auto"});
                    this.start = true;
                });
            });
        }
        else {
            this.start = false;
            $(this.element.current).animate({left: currentLeft - movement}, this.animationSpeed, () => {
                this.start = true;
            });
        }
    }

    moveRight = () => {
        if(!this.start) return;
        const currentLeft = parseInt($(this.element.current).css('left'));
        const currentRight = parseInt($(this.element.current).css('right'));
        let movement = this.state.containerWidth;

        if (currentLeft > -this.state.containerWidth && currentLeft < 0) {
            movement = -currentLeft;
        }

        if (currentLeft == 0) {
            this.start = false;
            $(this.element.current).animate({left: "150px"}, this.animationSpeed, () => {
                $(this.element.current).animate({left: "0px"}, 50, () => {
                    $(this.element.current).css({"left": "auto"});
                    this.start = true;
                });
            });
        }
        else {
            this.start = false;
            $(this.element.current).animate({left: currentLeft + movement}, this.animationSpeed, () => {
                this.start = true;
            });
        }
    }

    mouseDownHandler = (e) => {
        if(this.element && this.element.current) {
            if(this.element.current.contains(e.target)) {
                if(!this.start || !this.state.isSlider) return;
                this.mouseDown = true;
                this.firstPosition = e.clientX;
                this.firstLeftPosition = parseInt($(this.element.current).css("left"));
                this.firstRightPosition = parseInt($(this.element.current).css("right"));
                this.dragSpeed = this.animationSpeed;
            }
        }
    }

    mouseMove = (e) => {
        if (this.mouseDown) {
            const currentLeftPosition = parseInt($(this.element.current).position().left);
            const currentRightPosition = parseInt($(this.element.current).css("right"));
            let currentMovement = this.firstPosition - e.clientX;


            if (this.firstLeftPosition > -this.state.containerWidth && currentMovement < 0 || this.firstRightPosition > -this.state.containerWidth && currentMovement > 0) {
                currentMovement = currentMovement * 0.2;
            }

            const newMovement = this.firstLeftPosition - currentMovement;

            $(this.element.current).css({"left": newMovement +  "px"}); 
            $("body").css({ "user-select" : "none" });
        }
        else {
            return;
        }
    }

    mouseUp = () => {
        if(this.mouseDown) {
            this.mouseDown = false;

            let movement = this.state.containerWidth;
            let newSliderPosition;
            const currentLeft = parseInt($(this.element.current).css("left"));
            const left = currentLeft - this.firstLeftPosition;
            const currentRight = parseInt($(this.element.current).css("right"));


            if (currentLeft > 0) {
                newSliderPosition = "0px";
                this.animationSpeed = 50;
            }
            else if (currentRight > 0) {
                newSliderPosition = -this.state.width + this.state.containerWidth + "px";
                this.animationSpeed = 50;
            }

            if (left < -50 && currentRight < 0) {
                if (this.firstRightPosition > -this.state.containerWidth) {
                    movement = -this.firstRightPosition;
                }
                newSliderPosition = this.firstLeftPosition - movement;
            } 
            else if (left > 50 && currentLeft < 0) {
                if (this.firstLeftPosition > -this.state.containerWidth) {
                    movement = -this.firstLeftPosition;
                }
                newSliderPosition = this.firstLeftPosition + movement;
            }
            else {
                newSliderPosition = this.firstLeftPosition;
            }
            this.start = false;
            $(this.element.current).animate({left: newSliderPosition}, this.animationSpeed, () => {
                this.start = true;
            });
            this.animationSpeed = 200;

            $("body").css({ "user-select" : "auto" });
        }
    }

    render() {
        let content = this.props.items.map(item => {
            if(this.props.itemType.toLowerCase() === "song") {
                return (
                    <SliderSong key={item.id+Math.random()*11} data={item} width={this.state.itemWidth} playlist={this.props.playlist}/>
                );
            }
            else if(this.props.itemType.toLowerCase() === "album") {
                return (
                    <SliderAlbum key={item.id+Math.random()*11} data={item} width={this.state.itemWidth}/>
                );
            }
            else if(this.props.itemType.toLowerCase() === "artist") {
                return (
                    <SliderArtist key={Math.random()*11} data={item} width={this.state.itemWidth} />
                );
            }
        });

        return (
            <div className={styles.mainRow}>
                <span className='sec_title'>{this.props.title}</span>
                {(window.innerWidth >= 800 ? <Button shape="sliderButton" otherClasses="next" forwardedRef={this.nextButton} click={this.moveLeft} customStyle={{"display": (!this.state.isSlider ? "none" : "flex"), "top": (this.props.itemType === "album" ? "65%" : "60%")}}><img src={rightArrow} className={styles.sliderArrow}/></Button> : null )}
                {(window.innerWidth >= 800 ?<Button shape="sliderButton" otherClasses="back" forwardedRef={this.backButton} click={this.moveRight} customStyle={{"display": (!this.state.isSlider ? "none" : "flex"), "top": (this.props.itemType === "album" ? "65%" : "60%")}}><img src={leftArrow} className={styles.sliderArrow}/></Button> : null )}
                <div className={styles.sliderContainer} ref={this.container} style={{"height": this.state.itemHeight + "px"}}>
                    <div className={styles.slider} ref={this.element} style={{"height": this.state.itemHeight + "px"}} >
                        {content}
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        showMenu: state.showMenu
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setShowMenu: (show) => dispatch({type: 'SHOW_MENU', show: show})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Slider);