import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

type Props = {
  isRecording: boolean;
  onPress: (event: GestureResponderEvent) => void;
};

export default function MicButton({ isRecording, onPress }: Props) {
  return (
    <TouchableOpacity style={[styles.button, isRecording && styles.recording]} onPress={onPress}>
      <Text style={styles.label}>{isRecording ? 'Stop' : 'Record'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#4c6ef5',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  recording: {
    backgroundColor: '#ff6b6b',
  },
  label: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
