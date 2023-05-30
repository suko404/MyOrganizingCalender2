import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import firebase from 'firebase';
import db from '../firebaseConfig';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { ListItem, Icon } from 'react-native-elements';
import { Base64 } from 'js-base64';

export default class PasswordDecryptor extends React.Component{
    constructor(){
        super();
        this.state = {
            savedPassword:[

            ],
            emailId:firebase.auth().currentUser.email,
            lastVisiblePassword:'',
        }
    }

    removePasswords = (item) =>{
        db.collection("encrypted_passwords").doc(item.docId).delete();
        this.getAllEncryptedPasswords();
    }
    keyExtractor = (item, index) => index.toString();

    renderItem = ({item, i}) =>(

   <ListItem key={i} title={item.application_name} subtitle={item.decryptedPassword}
     //leftElement={<Icon name='book' type='font-awesome' color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
         <TouchableOpacity style={styles.deleteButtonStyling} onPress = {()=>{
             this.removePasswords(item);
         }}>
         <Text style={{color:'#ffff'}}>Delete</Text>
         </TouchableOpacity>
         }
       bottomDivider />

    )
    //     return(
    //         <ListItem key = {i}
    //                   bottomDivider
    //         >
    //             <ListItem.Content>
    //                 <ListItem.Title>
    //                     {item.application_name}
    //                 </ListItem.Title>

    //                 <ListItem.Subtitle>
    //                     {item.decryptedPassword}
    //                 </ListItem.Subtitle>
    //             </ListItem.Content>
    //             <ListItem.Chevron color = 'red' onPress = {console.log(item)}>
    //                 <Icon name = "keyboard-arrow-right" type = "font-awesome"/>
    //             </ListItem.Chevron>
    //         </ListItem>
    // );

//    fetchMorePasswords = async() =>{
//         db.collection("encrypted_passwords")
//         .where("email_id", "==", this.state.emailId)
//         .startAfter(this.state.lastVisiblePassword)
//         .orderBy(this.state.lastVisiblePassword.docId)
//         .limit(10)
//         .get()
//         .docs.map((doc)=>{
//             this.setState({
//                 savedPassword:[...this.state.savedPassword, doc.data()],
//                 lastVisiblePassword:doc,
//             });
//         });
//     }
    getAllEncryptedPasswords = () =>{
        var currentUser = firebase.auth().currentUser.email;
        console.log("user email ", currentUser)
        db.collection("encrypted_passwords").where("email_id", "==", currentUser)
        .get()
        .then((snapshot)=>{
            var passwords = [];
            snapshot.forEach((doc)=>{
                var data = doc.data();
                var encryptedPassword = data.password;
                var decryptedPassword = Base64.decode(encryptedPassword);
                console.log(decryptedPassword);
                data["decryptedPassword"] = decryptedPassword;
                data["docId"] = doc.id;
                passwords.push(data);
                this.setState({
                    lastVisiblePassword:data,
                })
            });
            this.setState({
                  savedPassword:passwords,
            });
            // console.log(this.state.savedPassword);
        });
    }
    componentDidMount(){
        this.getAllEncryptedPasswords();
    }

    componentDidUpdate(){
        this.getAllEncryptedPasswords();
    }
    render(){
        return(
            <View>
                    {this.state.savedPassword.length === 0 ? (
                        <View style = {{justifyContent:'center', alignItems:'center', flex:1}}>
                            <Text style = {{fontWeight:'bold', fontSize:20}}> There are no passwords saved </Text>
                            <Text> {this.state.savedPassword} </Text>
                        </View>
                    )   :
                    (
                        <View>
                        <ScrollView>
                          <FlatList keyExtractor = {this.keyExtractor}
                                    data = {this.state.savedPassword}
                                    renderItem = {this.renderItem}
                          />
                          </ScrollView>
                        </View>
                    )
                    }
            </View>
        );
    }

}
const styles = StyleSheet.create({
    deleteButtonStyling:{
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"red",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 7 },
        borderRadius:15,
    }
})