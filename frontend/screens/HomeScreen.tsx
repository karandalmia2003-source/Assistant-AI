import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import MicButton from '../components/MicButton';

const API_BASE_URL = 'http://localhost:4000/api';

export default function HomeScreen() {
  const [textInput, setTextInput] = useState('');
  const [lastMemory, setLastMemory] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const submitTextMemory = async () => {
    if (!textInput.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/memories/from-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: textInput }),
      });
      const data = await response.json();
      setLastMemory(data);
      setTextInput('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create memory from text');
    }
  };

  const toggleRecording = async () => {
    if (isRecording && recording) {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (!uri) return;

      try {
        const fileInfo = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const formData = new FormData();
        formData.append('audio', {
          uri,
          name: 'audio.m4a',
          type: 'audio/m4a',
        } as any);

        const response = await fetch(`${API_BASE_URL}/memories/from-voice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const data = await response.json();
        setLastMemory(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to create memory from voice');
      }
    } else {
      try {
        const permission = await Audio.requestPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission required', 'Microphone access is needed to record reminders.');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(newRecording);
        setIsRecording(true);
      } catch (error) {
        Alert.alert('Error', 'Could not start recording');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Record a reminder</Text>
      <MicButton isRecording={isRecording} onPress={toggleRecording} />

      <Text style={styles.heading}>Or type one</Text>
      <TextInput
        style={styles.input}
        placeholder="Remind me tomorrow at 9 PM to..."
        value={textInput}
        onChangeText={setTextInput}
      />
      <Button title="Save Reminder" onPress={submitTextMemory} />

      {lastMemory && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Last memory:</Text>
          <Text>{lastMemory.rawText}</Text>
          <Text>{lastMemory.title}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f7f7f7',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    backgroundColor: '#fff',
  },
  result: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
