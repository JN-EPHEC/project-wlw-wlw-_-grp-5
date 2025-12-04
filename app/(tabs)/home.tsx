import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>✴</Text>
        <Text style={styles.headerTitle}>Tableau de Bord</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* Bloc humeur rapide */}
      <View style={styles.moodCard}>
        <Text style={styles.moodTitle}>Esprit Santé</Text>
        <Text style={styles.moodQuestion}>Comment te sens-tu aujourd'hui ?</Text>
        <TouchableOpacity style={styles.moodBtn}>
          <Text style={styles.moodBtnText}>Enregistrer mon humeur</Text>
        </TouchableOpacity>
      </View>

      {/* Raccourcis grille */}
      <View style={styles.shortcutsGrid}>
        <View style={styles.shortcutCol}>
          <TouchableOpacity style={styles.shortcutBtn}><Text style={styles.shortcutIcon}>💚</Text></TouchableOpacity>
          <Text style={styles.shortcutLabel}>Mon Humeur</Text>
        </View>
        <View style={styles.shortcutCol}>
          <TouchableOpacity style={styles.shortcutBtn}><Text style={styles.shortcutIcon}>🧘‍♂️</Text></TouchableOpacity>
          <Text style={styles.shortcutLabel}>MindSet</Text>
        </View>
        <View style={styles.shortcutCol}>
          <TouchableOpacity style={styles.shortcutBtn}><Text style={styles.shortcutIcon}>💬</Text></TouchableOpacity>
          <Text style={styles.shortcutLabel}>Discussions</Text>
        </View>
        <View style={styles.shortcutCol}>
          <TouchableOpacity style={styles.shortcutBtn}><Text style={styles.shortcutIcon}>👤</Text></TouchableOpacity>
          <Text style={styles.shortcutLabel}>Mon Profil</Text>
        </View>
      </View>

      {/* Graphiques d'évolution */}
      <Text style={styles.sectionTitle}>Graphiques d'évolution</Text>
      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>Humeur</Text>
        <View style={styles.graphPlaceholder}><Text style={{color:'#27ae60'}}>[Graphique ligne humeur]</Text></View>
        <TouchableOpacity style={styles.graphBtn}><Text style={styles.graphBtnText}>Voir toute la tendance</Text></TouchableOpacity>
      </View>
      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>Stress</Text>
        <View style={styles.graphPlaceholder}><Text style={{color:'#e74c3c'}}>[Graphique barres stress]</Text></View>
        <TouchableOpacity style={styles.graphBtn}><Text style={styles.graphBtnText}>Voir toute la tendance</Text></TouchableOpacity>
      </View>
      <View style={[styles.graphCard, {borderColor:'#f5e6ff'}]}>
        <Text style={styles.graphTitle}>Énergie</Text>
        <View style={styles.graphPlaceholder}><Text style={{color:'#f1c40f'}}>[Graphique ligne énergie]</Text></View>
        <TouchableOpacity style={styles.graphBtn}><Text style={styles.graphBtnText}>Voir toute la tendance</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
  },
  profileBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 24,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  actionCard: {
    backgroundColor: '#eafcf3',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    width: '30%',
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  suggestionCard: {
    backgroundColor: '#f7f7fa',
    borderRadius: 14,
    padding: 18,
    marginTop: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 6,
  },
  suggestionText: {
    fontSize: 15,
    color: '#444',
  },
  moodCard: {
    backgroundColor: '#eafcf3',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
  },
  moodTitle: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  moodQuestion: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  moodBtn: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  moodBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  shortcutCol: {
    alignItems: 'center',
    flex: 1,
  },
  shortcutBtn: {
    backgroundColor: '#f7f7fa',
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  shortcutIcon: {
    fontSize: 22,
  },
  shortcutLabel: {
    fontSize: 13,
    color: '#222',
    textAlign: 'center',
    marginBottom: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
    marginTop: 8,
  },
  graphCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eafcf3',
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  graphTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 6,
  },
  graphPlaceholder: {
    height: 60,
    backgroundColor: '#f7f7fa',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  graphBtn: {
    backgroundColor: '#f7f7fa',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  graphBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 14,
  },

});
