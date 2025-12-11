import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function MoodHistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Historique de l’humeur</Text>
        <Text style={styles.text}>Écran placeholder pour la timeline des entrées.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  text: {
    marginTop: 8,
    color: '#6B6F85',
  },
});
