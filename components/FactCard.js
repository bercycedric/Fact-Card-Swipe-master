import React, { Component } from "react";
import { Button, Image, Linking, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

class FactCard extends Component {
    render () {
        return (<View style={styles.container}>
            <Image style={styles.image} source={{uri: this.props.fact.image}}/>

            <View height={hp("15%")}>
                <Text style={styles.text}>{this.props.fact.text}</Text>
            </View>

            <Button onPress={() => Linking.openURL(this.props.fact.source_url)} disabled={this.props.disabled} title="See the source"/>
        </View>);
    };
}

const styles = StyleSheet.create({
    container: {
        elevation: 1,
        shadowColor: "#000000",
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.7,
        width: wp("90%"),
        backgroundColor: "#ffffff"
    },
    image: {
        width: wp("90%"),
        height: hp("30%")
    },
    text: {
        padding: 10
    }
});

export default FactCard;
