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
var ToDo=require('./ToDo');
var Calendar = require('react-native-calendar');
var Firebase = require('firebase');
var moment=require('moment');
var customDayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//Add the class
class devdacticFirebase extends Component{
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
     <Calendar
          ref="calendar"
          eventDates={['2015-07-03', '2015-07-05', '2015-07-10', '2015-07-15', '2015-07-20', '2015-07-25', '2015-07-28', '2015-07-30']}
          scrollEnabled={true}
          showControls={true}
          dayHeadings={customDayHeadings}
          titleFormat={'MMMM YYYY'}
          prevButtonText={'Prev'}
          nextButtonText={'Next'}
          onDateSelect={(date) => this.setState({selectedDate: date})}
          onTouchPrev={() => console.log('Back TOUCH')}
          onTouchNext={() => console.log('Forward TOUCH')}
          onSwipePrev={() => console.log('Back SWIPE')}
          onSwipeNext={() => console.log('Forward SWIPE')}/>
      <View style={styles.ListViewContainer}/>
          <ListView
            dataSource={this.state.todoSource}
            renderRow={this.renderRow.bind(this)} 
            style = {styles.ListViewContainer}/>
      </View>
  );
}

renderRow(rowData) {
  return (
    <TouchableHighlight
      underlayColor='#dddddd'
      onPress={() => this.onReminderPressed()}>
      <View>
        <View style={styles.row}>
          <Text style={styles.todoText}>{rowData.text.todo}</Text>
        </View>
        <View style={styles.separator} />
      </View>
    </TouchableHighlight>
  );
}

  onReminderPressed(){
    this.props.navigator.push({
        title: "Reminder",
        component: ToDo
    });
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



}

/*
Construct a view. Stylish topbar with the apptitle
The input container for new todos
button to submit the todo to the firebase
listview displaying all of todo
*/

var styles = StyleSheet.create({
  appContainer:{
    flex: 1,
    flexDirection: 'column',
    height: this.height
  },
  ListViewContainer:{
    
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
    padding: 5,
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
    height: 44,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  todoText: {
    flex: 1,
  }
});

module.exports=devdacticFirebase ;
//AppRegistry.registerComponent('devdacticFirebase', () => devdacticFirebase);