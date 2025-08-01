import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const BACKEND = 'https://superfan-verified.onrender.com';

export default function VerificationScreen({ route }) {
  const { userAddress } = route.params;
  const [plays, setPlays] = useState('3500');
  const [result, setResult] = useState(null);

  const verify = async () => {
    try {
      const res = await fetch(`${BACKEND}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: userAddress,
          platform: 'spotify',
          artist: 'TaylorSwift',
          totalPlays: parseInt(plays, 10),
        }),
      });
      const json = await res.json();
      if (json.badge) {
        setResult(`Verified: ${json.badge.level}`);
      } else {
        setResult('Failed');
      }
    } catch (e) {
      setResult('Error');
    }
  };

  return (
    <View style={{ flex:1, padding:20, backgroundColor:'#0f0f2f' }}>
      <Text style={{ fontSize:18, fontWeight:'bold', color:'#fff' }}>Verify Fan Activity</Text>
      <Text style={{ color:'#ccc', marginTop:8 }}>Artist: Taylor Swift</Text>
      <TextInput
        value={plays}
        onChangeText={setPlays}
        keyboardType="numeric"
        style={{ backgroundColor:'#1f1f4f', color:'#fff', padding:10, borderRadius:8, marginVertical:12 }}
      />
      <Button title="Verify" onPress={verify} />
      {result && <Text style={{ marginTop:16, color:'#6c63ff' }}>{result}</Text>}
    </View>
  );
}
