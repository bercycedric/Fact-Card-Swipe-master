import React, { Component } from "react";
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native";
import FactCard from "./components/FactCard";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import axios from "axios";

const MAX_LEFT_ROTATION_DISTANCE  = wp("150%") * -1;
const MAX_RIGHT_ROTATION_DISTANCE = wp("150%");
const LEFT_TRESHOLD_BEFORE_SWIPE  = wp("-50%");
const RIGHT_TRESHOLD_BEFORE_SWIPE = wp("50%");
const FACT_URL                    = "https://uselessfacts.jsph.pl/random.json";
const RANDOM_IMAGE_URL            = `https://picsum.photos/${Math.floor(hp("30%"))}/${Math.floor(wp("90%"))}?image=`;

export default class App extends Component {
    constructor (props) {
        super(props);
        this.state    = {
            panResponder: undefined,
            topFact: undefined,
            bottomFact: undefined
        };
        this.position = new Animated.ValueXY();
    }

    componentDidMount () {
        const panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (event, gesture) => {
                return Math.abs(gesture.dx) > Math.abs(gesture.dy * 3);
            },
            onPanResponderMove: (event, gesture) => {
                this.position.setValue({
                    x: gesture.dx,
                    y: 0
                });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx < LEFT_TRESHOLD_BEFORE_SWIPE) {
                    this.forceLeftExit();
                } else if (gesture.dx > RIGHT_TRESHOLD_BEFORE_SWIPE) {
                    this.forceRightExit();
                } else {
                    this.resetPositionSoft();
                }
            }
        });

        this.setState({panResponder}, () => {
            this.loadTopFact();
            this.loadBottomFact();
        });
    }

    loadTopFact () {
        axios.get(FACT_URL)
             .then(response => {
                 this.setState({
                     topFact: {
                         ...response.data,
                         image: this.getRandomImageUrl()
                     }
                 });
             });
    }

    loadBottomFact () {
        axios.get(FACT_URL)
             .then(response => {
                 this.setState({
                     bottomFact: {
                         ...response.data,
                         image: this.getRandomImageUrl()
                     }
                 });
             });
    }

    getRandomImageUrl () {
        return `${RANDOM_IMAGE_URL}${Math.floor(Math.random() * 500 + 1)}`;
    }

    onCardExitDone = () => {
        this.setState({topFact: this.state.bottomFact});
        this.loadBottomFact();
        this.position.setValue({
            x: 0,
            y: 0
        });
    };

    forceLeftExit () {
        Animated.timing(this.position, {
            toValue: {
                x: wp("-100%"),
                y: 0
            }
        })
                .start(this.onCardExitDone);
    }

    forceRightExit () {
        Animated.timing(this.position, {
            toValue: {
                x: wp("100%"),
                y: 0
            }
        })
                .start(this.onCardExitDone);
    }

    resetPositionSoft () {
        Animated.spring(this.position, {
            toValue: {
                x: 0,
                y: 0
            }
        })
                .start();
    }

    getCardStyle () {
        const rotation = this.position.x.interpolate({
            inputRange: [
                MAX_LEFT_ROTATION_DISTANCE,
                0,
                MAX_RIGHT_ROTATION_DISTANCE
            ],
            outputRange: [
                "-120deg",
                "0deg",
                "120deg"
            ]
        });

        return {
            transform: [{rotate: rotation}], ...this.position.getLayout()
        };
    }

    renderTopCard () {
        /* Les "..." signifient que chaque clé / valeur de l'objet panHandlers va être mise en props du component Animated.View*/
        return (<Animated.View {...this.state.panResponder.panHandlers} style={this.getCardStyle()}>
            <FactCard disabled={false} fact={this.state.topFact}/>
        </Animated.View>);
    }

    renderBottomCard () {
        return (<View style={styles.bottomCard}><FactCard disabled={true} fact={this.state.bottomFact}/></View>);
    }

    render () {
        return (<View style={styles.container}>
            <Text style={styles.title}>Fact Swipe</Text>

            <View>
                {this.state.topFact && this.renderTopCard()}
                {this.state.bottomFact && this.renderBottomCard()}
            </View>
        </View>);
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center",
        marginTop: 50
    },
    title: {
        fontSize: 30
    },
    bottomCard: {
        zIndex: -1,
        position: "absolute"
    }
});
