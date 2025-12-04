import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function JournalHumeur() {
  const [humeur, setHumeur] = useState(5);
  const [energie, setEnergie] = useState(5);
  const [stress, setStress] = useState(5);
  const [ressenti, setRessenti] = useState('');

  const handleSubmit = () => {
    alert(`Humeur: ${humeur}\nÉnergie: ${energie}\nStress: ${stress}\nRessenti: ${ressenti}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal d'humeur</Text>

      {/* Humeur */}
      <View style={styles.row}>
        <Text style={styles.label}>Humeur</Text>
        <View style={[styles.badge, {backgroundColor:'#ffe066'}]}>
          <Text style={styles.badgeText}>{humeur}</Text>
        </View>
      </View>
      <Slider
        value={humeur}
        onValueChange={setHumeur}
        minimumValue={1}
        maximumValue={10}
        step={1}
        style={styles.slider}
        minimumTrackTintColor="#ffe066"
        thumbTintColor="#ffe066"
      />
      <View style={styles.scaleRow}>
        <Text style={styles.scaleText}>1</Text>
        <Text style={styles.scaleText}>10</Text>
      </View>

      {/* Energie */}
      <View style={styles.row}>
        <Text style={styles.label}>Énergie</Text>
        <View style={[styles.badge, {backgroundColor:'#b2f7ef'}]}>
          <Text style={styles.badgeText}>{energie}</Text>
        </View>
      </View>
      <Slider
        value={energie}
        onValueChange={setEnergie}
        minimumValue={1}
        maximumValue={10}
        step={1}
        style={styles.slider}
        minimumTrackTintColor="#b2f7ef"
        thumbTintColor="#b2f7ef"
      />
      <View style={styles.scaleRow}>
        <Text style={styles.scaleText}>1</Text>
        <Text style={styles.scaleText}>10</Text>
      </View>

      {/* Stress */}
      <View style={styles.row}>
        <Text style={styles.label}>Stress</Text>
        <View style={[styles.badge, {backgroundColor:'#ffb3b3'}]}>
          <Text style={styles.badgeText}>{stress}</Text>
        </View>
      </View>
      <Slider
        value={stress}
        onValueChange={setStress}
        minimumValue={1}
        maximumValue={10}
        step={1}
        style={styles.slider}
        minimumTrackTintColor="#ffb3b3"
        thumbTintColor="#ffb3b3"
      />
      <View style={styles.scaleRow}>
        <Text style={styles.scaleText}>1</Text>
        <Text style={styles.scaleText}>10</Text>
      </View>

      {/* Ressenti */}
      <Text style={styles.question}>Que ressens-tu ?</Text>
      <TextInput
        style={styles.input}
        value={ressenti}
        onChangeText={setRessenti}
        placeholder="Écris ici tes pensées et tes sentiments..."
        multiline
      />

      {/* Bouton Valider */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f7f7fa',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
  },
  badge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  slider: {
    marginVertical: 8,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scaleText: {
    fontSize: 12,
    color: '#888',
  },
  question: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: '#fafbfc',
  },
  button: {
    backgroundColor: '#b7eacb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});
