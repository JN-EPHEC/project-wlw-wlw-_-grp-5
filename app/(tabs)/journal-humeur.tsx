import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function JournalHumeur() {
  const [humeur, setHumeur] = useState(5);
  const [energie, setEnergie] = useState(5);
  const [stress, setStress] = useState(5);
  const [ressenti, setRessenti] = useState('');

  const handleSubmit = () => {
    // Ici, tu peux gérer l'enregistrement des données (API, local, etc.)
    alert(`Humeur: ${humeur}\nÉnergie: ${energie}\nStress: ${stress}\nRessenti: ${ressenti}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal d'humeur</Text>
      <Text>Humeur (1-10): {humeur}</Text>
      <Slider
        value={humeur}
        onValueChange={setHumeur}
        minimumValue={1}
        maximumValue={10}
        step={1}
        style={styles.slider}
      />
      <Text>Énergie (1-10): {energie}</Text>
      <Slider
        value={energie}
        onValueChange={setEnergie}
        minimumValue={1}
        maximumValue={10}
        step={1}
        style={styles.slider}
      />
      <Text>Stress (1-10): {stress}</Text>
      <Slider
        value={stress}
        onValueChange={setStress}
        minimumValue={1}
        maximumValue={10}
        step={1}
        style={styles.slider}
      />
      <Text style={styles.question}>Que ressens-tu ?</Text>
      <TextInput
        style={styles.input}
        value={ressenti}
        onChangeText={setRessenti}
        placeholder="Exprime ton ressenti..."
        multiline
      />
      <Button title="Enregistrer" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  slider: {
    marginVertical: 12,
  },
  question: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    minHeight: 60,
    textAlignVertical: 'top',
  },
});
