import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

const BACKEND = 'https://superfan-verified.onrender.com';

export default function DashboardScreen({ route, navigation }) {
  const { userAddress } = route.params;
  const [leaderboard, setLeaderboard] = useState([]);
  const [badge, setBadge] = useState(null);
  const [status, setStatus] = useState('loading…');

  const fetchData = async () => {
    try {
      const lb = await fetch(`${BACKEND}/leaderboard/TaylorSwift`).then(r => r.json());
      setLeaderboard(lb.top || []);
      const b = await fetch(`${BACKEND}/badge/${userAddress}`);
      if (b.ok) {
        const bj = await b.json();
        setBadge(bj);
      }
      setStatus('ready');
    } catch (e) {
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView style={{ flex:1, padding:20, backgroundColor:'#0f0f2f' }}>
      <Text style={{ fontSize:20, fontWeight:'bold', color:'#fff' }}>Welcome, {userAddress}</Text>
      <View style={{ marginVertical:16, padding:12, backgroundColor:'#1f1f4f', borderRadius:10 }}>
        <Text style={{ color:'#fff', fontSize:16 }}>Your Badge:</Text>
        {badge ? (
          <>
            <Text style={{ color:'#6c63ff' }}>Level: {badge.badgeLevel || badge.level}</Text>
            <Text style={{ color:'#fff' }}>Artist: {badge.artist}</Text>
            <Text style={{ color:'#aaa' }}>Issued: {new Date(badge.issuedAt).toLocaleString()}</Text>
          </>
        ) : (
          <Text style={{ color:'#999' }}>No badge yet. Verify fan activity.</Text>
        )}
      </View>

      <View style={{ marginVertical:16 }}>
        <Text style={{ fontSize:16, color:'#fff', marginBottom:8 }}>Leaderboard – Taylor Swift</Text>
        {leaderboard.map((entry, i) => (
          <View key={i} style={{ flexDirection:'row', justifyContent:'space-between', padding:8, backgroundColor:'#1f1f3f', borderRadius:8, marginBottom:4 }}>
            <Text style={{ color:'#fff' }}>{i+1}. {entry.user}</Text>
            <Text style={{ color:'#fff' }}>{entry.score} plays</Text>
          </View>
        ))}
      </View>

      <Button title="Verify Fan Activity" onPress={() => navigation.navigate('Verify', { userAddress })} />
      <View style={{ marginTop:12 }}>
        <Button title="Refresh" onPress={fetchData} />
      </View>
      <Text style={{ color:'#888', marginTop:8 }}>Status: {status}</Text>
    </ScrollView>
  );
}
