"use strict";
 
var React = require("react-native");
var Calendar = require("react-native-calendar");
 
var {
    Component,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
} = React;
 
var ToDo = require("./ToDo");
var Calendar=require("./Calendar");


 
class LoginPage extends Component {
 
    constructor(props) {
        super(props);
        var ref = new Firebase("https://sweltering-fire-3013.firebaseio.com");
        this.state = {
            username: "",
            password: ""
        };
    }
 
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Sign In
                </Text>
                <View>
                    <TextInput
                        placeholder="Username"
                        onChange={(event) => this.setState({username: event.nativeEvent.text})}
                        style={styles.formInput}
                        value={this.state.username} />
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={true}
                        onChange={(event) => this.setState({password: event.nativeEvent.text})}
                        style={styles.formInput}
                        value={this.state.password} />
                    <TouchableHighlight onPress={this.authenticateWithPass.bind(this)} style={styles.button}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this.onCreatePressed.bind(this)} style={styles.button}>
                        <Text style = {styles.buttonText}>Create Account</Text>
                    </TouchableHighlight> 
                    <TouchableHighlight onPress={this.onFacebookPressed.bind(this)} style={styles.button}>
                        <Text style = {styles.buttonText}>Facebook</Text>
                    </TouchableHighlight>   
                </View>
            </View>
        );
    }

    //Facbook Login
    onFacebookPressed(){
        var ref = new Firebase("https://sweltering-fire-3013.firebaseio.com");
        ref.authWithOAuthPopup("facebook", function(error, authData) {
            remember: "sessionOnly"
          if (error) {
            console.log("Login Failed!", error);
          } else {
            // the access token will allow us to make Open Graph API calls
            console.log(authData.facebook.accessToken);
          }
        }, {
          scope: "email,user_likes" // the permissions requested
        });
    }

    authenticateWithPass(event){
        var ref = new Firebase("https://sweltering-fire-3013.firebaseio.com");
        var signal = false;
        var props=this.props;
        var self = this;
        ref.authWithPassword({
          email    : this.state.username,
          password : this.state.password
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            props.navigator.push({        
            title: "Calendar",
            component: Calendar,
            passProps: {username: self.state.username, password: self.state.password},
            });
          }
        });
            
        
    }
 

    onCreatePressed(){
        var ref = new Firebase("https://sweltering-fire-3013.firebaseio.com");
        ref.createUser({
          email    : this.state.username,
          password : this.state.password
        }, function(error, userData) {
          if (error) {
            console.log("Error creating user:", error);
          } else {
            console.log("Successfully created user account with uid:", userData.uid);
          }
});
    }
 
};
 
var styles = StyleSheet.create({
    container: {
        padding: 30,
        marginTop: 65,
        alignItems: "stretch"
    },
    title: {
        fontSize: 18,
        marginBottom: 10
    },
    formInput: {
        height: 36,
        padding: 10,
        marginRight: 5,
        marginBottom: 5,
        marginTop: 5,
        flex: 1,
        fontSize: 18,
        borderWidth: 1,
        borderColor: "#555555",
        borderRadius: 8,
        color: "#555555"
    },
    button: {
        height: 36,
        flex: 1,
        backgroundColor: "#555555",
        borderColor: "#555555",
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 10,
        justifyContent: "center"
    },
    buttonText: {
        fontSize: 18,
        color: "#ffffff",
        alignSelf: "center"
    },
});
 
module.exports = LoginPage;