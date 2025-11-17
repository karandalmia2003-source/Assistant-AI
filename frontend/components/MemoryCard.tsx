import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Memory = {
  id: string;
  title: string;
  dueDatetime: string | null;
};

type Props = {
  memory: Memory;
};

export default function MemoryCard({ memory }: Props) {
  const formattedDate = memory.dueDatetime
    ? new Date(memory.dueDatetime).toLocaleString()
    : 'No due date';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{memory.title}</Text>
      <Text style={styles.subtitle}>{formattedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#555',
  },
});
