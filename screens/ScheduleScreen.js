// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import CalenderScreen from './CalenderScreen';
import { ListItem, Icon } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import db from '../firebaseConfig';
import firebase from 'firebase';

export default class ScheduleScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      array:[


      ]
    }
  }
  keyExtractor = (item, index) => index.toString();

  getAllTasksToBeDone = () =>{
    var currentUser = firebase.auth().currentUser.email;
    console.log("user email ", currentUser)
    db.collection("tasks_to_do").where("email_id", "==", currentUser)
    .get()
    .then((snapshot)=>{
        var tasks = [];
        snapshot.forEach((doc)=>{
            var data = doc.data();
            data["docId"] = doc.id;
            tasks.push(data);
        });
        this.setState({
              array:tasks,
        });
        // console.log(this.state.array);
    });
}
removeTask = (item) =>{
  db.collection("tasks_to_do").doc(item.docId).delete();
  this.getAllTasksToBeDone();
}
componentDidMount(){
  this.getAllTasksToBeDone();
}
componentDidUpdate(){
 this.getAllTasksToBeDone();
}
  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.task_to_be_done}
        subtitle={item.date}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        leftElement = {
          <Image style = {{width:45, height:45, borderRadius:12}} source = {{uri:'./assets/scheduling.png'}} />
        }
        rightElement={
            <Icon name = 'clock-o' type = 'font-awesome' onPress = {()=>this.removeTask(item)}/>
          }
        bottomDivider
      />
    )
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text> {this.state.selectedStartDate} </Text>
        <View></View>
        <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.array}
                renderItem={this.renderItem}
              />
      </View>
    );
  }
}
