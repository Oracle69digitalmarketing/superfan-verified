import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Button, View, ScrollView, ActivityIndicator } from 'react-native';

const API_BASE = 'http://localhost:4000'; // adjust if backend not local

export default function App() {
  const [badge, setBadge] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  const verifyFan = async () => {
    setLoading(true);
    try {
      // fetch mock streaming history
      const historyRes = await fetch(\`\${API_BASE}/mock/streaming-history?platform=spotify&user=alice&artist=TaylorSwift\`);
      const history = await historyRes.json();

      const verifyRes = await fetch(\`\${API_BASE}/verify\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: history.user,
          platform: history.platform,
          artist: history.artist,
          totalPlays: history.totalPlays
        }),
      });
      const verifyData = await verifyRes.json();
      setBadge(verifyData.badge);

      const boardRes = await fetch(\`\${API_BASE}/leaderboard/TaylorSwift\`);
      const board = await boardRes.json();
      setLeaderboard(board.top);
    } catch (err) {
      console.error('Error verifying fan:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    verifyFan();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#0f0f2f' }}>
      <ScrollView>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#fff' }}>
          Superfan Verified
        </Text>
        {loading && <ActivityIndicator size="large" />}
        {badge && (
          <View style={{ padding: 15, backgroundColor: '#1f1f4f', borderRadius: 12, marginBottom: 20 }}>
            <Text style={{ color: '#f0f', fontSize: 18 }}>Badge: {badge.level.toUpperCase()}</Text>
            <Text style={{ color: '#fff' }}>Artist: {badge.artist}</Text>
            <Text style={{ color: '#aaa' }}>Issued: {new Date(badge.issuedAt).toLocaleString()}</Text>
          </View>
        )}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, color: '#fff', marginBottom: 5 }}>Leaderboard - TaylorSwift</Text>
          {leaderboard.map((entry, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8, backgroundColor: '#1f1f3f', borderRadius: 8, marginBottom: 4 }}>
              <Text style={{ color: '#fff' }}>{i + 1}. {entry.user}</Text>
              <Text style={{ color: '#fff' }}>{entry.score} plays</Text>
            </View>
          ))}
        </View>
        <Button title="Refresh / Reverify" onPress={verifyFan} />
      </ScrollView>
    </SafeAreaView>
  );
}
