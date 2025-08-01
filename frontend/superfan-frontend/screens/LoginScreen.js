import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [userId, setUserId] = useState('alice'); // placeholder, replace with Meta Account login

  const proceed = () => {
    navigation.navigate('Dashboard', { userAddress: userId });
  };

  return (
    <View style={{ flex:1, padding:20, justifyContent:'center', backgroundColor:'#0f0f2f' }}>
      <Text style={{ fontSize:24, fontWeight:'bold', color:'#fff', marginBottom:12 }}>Superfan Verified</Text>
      <Text style={{ color:'#ccc' }}>Fan ID / Wallet Address</Text>
      <TextInput
        value={userId}
        onChangeText={setUserId}
        placeholder="alice"
        style={{ backgroundColor:'#1f1f4f', color:'#fff', padding:10, borderRadius:8, marginVertical:12 }}
      />
      <Button title="Continue" onPress={proceed} />
    </View>
  );
}
