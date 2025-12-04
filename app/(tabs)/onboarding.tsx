import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Onboarding() {
  return (
    <View style={styles.container}>
      {/* Header logo + Passer */}
      <View style={styles.headerRow}>
        <Text style={styles.logo}>✴ MINDLY</Text>
        <TouchableOpacity><Text style={styles.skip}>Passer</Text></TouchableOpacity>
      </View>

      {/* Titre principal */}
      <Text style={styles.bigTitle}>Prends soin de ton esprit, chaque jour.</Text>

      {/* Carte verte */}
      <View style={styles.card}>
          {Platform.OS === 'web' ? (
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" style={{width:120, height:80, borderRadius:12, marginBottom:12, objectFit:'cover'}} alt="Cultivez votre sérénité" />
          ) : (
            <Image source={{uri:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'}} style={styles.cardImage} />
          )}
        <Text style={styles.cardTitle}>Cultivez votre sérénité</Text>
        <Text style={styles.cardDesc}>Apprenez des techniques de relaxation et de pleine conscience pour mieux gérer le stress et améliorer votre bien-être émotionnel.</Text>
      </View>

      {/* Pagination */}
      <View style={styles.paginationRow}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Boutons */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryBtn}>
        <Text style={styles.secondaryText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  secondaryText: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePlaceholder: {
    width: 180,
    height: 180,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7fa',
    borderRadius: 90,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  skip: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 15,
  },
  bigTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
    textAlign: 'left',
  },
  card: {
    backgroundColor: '#eafcf3',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginBottom: 18,
  },
  cardImage: {
    width: 120,
    height: 80,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 2,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d3e6db',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#27ae60',
  },
});
