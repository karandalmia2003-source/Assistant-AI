import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import MemoryCard from '../components/MemoryCard';

const API_BASE_URL = 'http://localhost:4000/api';

type Memory = {
  id: string;
  title: string;
  dueDatetime: string | null;
};

export default function SummaryScreen() {
  const [summary, setSummary] = useState('');
  const [items, setItems] = useState<Memory[]>([]);

  const fetchSummary = async () => {
    const response = await fetch(`${API_BASE_URL}/summary/tomorrow`);
    const data = await response.json();
    setSummary(data.summary);
    setItems(data.items || []);
  };

  return (
    <View style={styles.container}>
      <Button title="Refresh Tomorrow's Summary" onPress={fetchSummary} />
      <Text style={styles.summaryText}>{summary}</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MemoryCard memory={item} />}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f7f7f7',
  },
  summaryText: {
    marginVertical: 16,
    fontSize: 16,
  },
});
