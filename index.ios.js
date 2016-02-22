"use strict";
var React = require("react-native");
 
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NavigatorIOS,
} = React;
 
var LoginView = require("./LoginPage");
 
var devdacticFirebase = React.createClass({
    render: function() {
        return (
            <NavigatorIOS
                style={styles.navigationContainer}
                initialRoute={{
                title: "Login",
                component: LoginView,
            }} />
        );
    }
});
 
var styles = StyleSheet.create({
    navigationContainer: {
        flex: 1
    }
});
 

AppRegistry.registerComponent('devdacticFirebase', () => devdacticFirebase);