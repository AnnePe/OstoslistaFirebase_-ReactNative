import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import { initializeApp } from'firebase/app';
import { getDatabase, push, remove, ref, onValue } from'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYTdXVSbFnLjAyz6WHsbRA8BraT5drP6Q",
  authDomain: "ostoslista-bdc5d.firebaseapp.com",
  projectId: "ostoslista-bdc5d",
  storageBucket: "ostoslista-bdc5d.appspot.com",
  messagingSenderId: "992337539250",
  appId: "1:992337539250:web:82f25aea6d220720e399ab",
  measurementId: "G-JP53XTCR9L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
const [amount, setAmount] = useState('');
const [product, setProduct] = useState('');
const [items, setItems] = useState([]);
const [ostos, setOstos] = useState([]);

const saveItem = () => {    //viittaus ja mitä viedään
    push(  
        ref(database, 'ostot/'), //viitaus
            { 'product': product, 'amount': amount }); //olio
}

const deleteItem = () => {    //viittaus ja mitä viedään
  console.log ('deleteItem', items);
 /* remove(  
    ref(database, 'ostot/'), //viitaus
        { 'key': items }); //olio*/
}

useEffect(() => 
{const itemsRef = ref(database, 'ostot/');  
onValue(itemsRef, (snapshot) => {
  const data = snapshot.val();  
    setItems(Object.values(data)); 
    console.log(data);
    console.log(Object.values(data));
    console.log(Object.keys(data));
    const items = data ? Object.keys(data).map(key => ({ key, ...data[key]})):[];
      setOstos(items);
    });
  }, []);


  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };



  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <TextInput placeholder='Amount'  style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button onPress={saveItem} title="Save" /> 
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}> bought</Text></View>} 
        data={ostos} 
        ItemSeparatorComponent={listSeparator} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
});
