'use strict'
var React = require('react-native');


var {
  Component,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  ListView

}=React;

var Firebase = require('firebase');
var moment=require('moment');

//Add the class
class ToDo extends Component{
  //Your Application Code
constructor(props) {
  super(props);
  var myFirebaseRef = new Firebase('https://sweltering-fire-3013.firebaseio.com/');
  this.itemsRef = myFirebaseRef.child('items');
 
  this.state = {
    newTodo: '',
    todoSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
  };
 
  this.items = [];
}


render() {
  return (
    <View style={styles.appContainer}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>
          My Todos
        </Text>
      </View>
      <View style={styles.inputcontainer}>
        <TextInput style={styles.input} onChangeText={(text) => this.setState({newTodo: text})} value={this.state.newTodo}/>
        <TouchableHighlight
          style={styles.button}
          onPress={() => this.addTodo()}
          underlayColor='#DDDDDD'>
         <Text style={styles.btnText}>Add!</Text>
        </TouchableHighlight>
      </View>
      <ListView
        dataSource={this.state.todoSource}
        renderRow={this.renderRow.bind(this)} />
    </View>
  );
}

renderRow(rowData) {
  return (
    <TouchableHighlight
      underlayColor='#dddddd'
      onPress={() => this.removeTodo(rowData)}>
      <View>
        <View style={styles.row}>
          <Text style={styles.todoText}>{rowData.text.todo}</Text>
        </View>
        <View style={styles.separator} />
      </View>
    </TouchableHighlight>
  );
}


/*
componentDidMount() is called when the application is created
Listen for Firebase child_added and child_removed events
Every time an entry is added or removed to the Firebase
storage, the app will receive this event

When an item is added, the new value is pushed into
the items array and update the datasource for the list

If an item get's removed, the filter function is used
to remove the one item from the array matching the removed
key. dataSnapshot.key() we get from the Firebase
automatically created unique id of the entry
*/
componentDidMount() {
  // When a todo is added
  this.itemsRef.on('child_added', (dataSnapshot) => {
    this.items.push({id: dataSnapshot.key(), text: dataSnapshot.val()});
    this.setState({
      todoSource: this.state.todoSource.cloneWithRows(this.items)
    });
  });
 
  // When a todo is removed
  this.itemsRef.on('child_removed', (dataSnapshot) => {
      this.items = this.items.filter((x) => x.id !== dataSnapshot.key());
      this.setState({
        todoSource: this.state.todoSource.cloneWithRows(this.items)
      });
  });
}

addTodo() {
  if (this.state.newTodo !== '') {
    this.itemsRef.push({
      todo: this.state.newTodo
    });
    this.setState({
      newTodo : ''
    });
  }
}

removeTodo(rowData) {
  this.itemsRef.child(rowData.id).remove();
}

LoginPage(){
  this.props.navigator.push({
     id: 'LoginPage',
    sceneConfig: Navigator.SceneConfigs.FloatFromBottom
  })
}

}

/*
Construct a view. Stylish topbar with the apptitle
The input container for new todos
button to submit the todo to the firebase
listview displaying all of todo
*/

var styles = StyleSheet.create({
  appContainer:{
    flex: 1
  },
  titleView:{
    backgroundColor: '#48afdb',
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  titleText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 20,
  },
  inputcontainer: {
    marginTop: 5,
    padding: 10,
    flexDirection: 'row'
  },
  button: {
    height: 36,
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#48afdb',
    justifyContent: 'center',
    color: '#FFFFFF',
    borderRadius: 4,
  },
  Loginbutton:{
    height: 36,
    flex: 2,
    flexDirection:'row',
    backgroundColor: '#48afdb',
    justifyContent: 'center',
    color: '#FFFFFF',
    borderRadius: 4,
  },
  btnText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 6,
  },
  input: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48afdb',
    borderRadius: 4,
    color: '#48BBEC'
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    height: 44
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  todoText: {
    flex: 1,
  }
});

module.exports=ToDo ;
//AppRegistry.registerComponent('devdacticFirebase', () => devdacticFirebase);