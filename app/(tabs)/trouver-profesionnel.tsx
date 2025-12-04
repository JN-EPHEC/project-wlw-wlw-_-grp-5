// screens/FindProfessionalScreen.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// --- Données fictives des professionnels basées sur la maquette ---
const PROFESSIONALS_DATA = [
  {
    id: '1',
    name: 'Dr. Sophie Dubois',
    title: 'Psychologue Clinicienne',
    rating: 5.0,
    description: 'Spécialisée en thérapies cognitives et comportementales, Dr. Dubois accompagne les adultes face à l’anxiété, la dépression et le stress',
    price: '80€',
    imageUri: 'https://images.unsplash.com/photo-1551061803-a21226068305?fit=crop&w=800&q=80', // Remplacer par des vraies images
  },
  {
    id: '2',
    name: 'M. Marc Lefevre',
    title: 'Coach Certifié',
    rating: 4.0,
    description: 'M. Lefevre offre un soutien aux familles et aux couples traversant des difficultés relationnelles. Son objectif est de renforcer la communication et les liens',
    price: '75€',
    imageUri: 'https://images.unsplash.com/photo-1544723795-3fb6469e380f?fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Mme. Chloé Bernard',
    title: 'Sophrologue',
    rating: 5.0,
    description: 'Aide à gérer le stress et l’anxiété par des techniques de relaxation et de respiration. Mme. Bernard propose des séances individuelles et de groupe pour',
    price: '60€',
    imageUri: 'https://images.unsplash.com/photo-1507003211169-0a6dd7228f2d?fit=crop&w=800&q=80',
  },
  {
    id: '4',
    name: 'Dr. Lucas Petit',
    title: 'Psychiatre',
    rating: 4.0,
    description: 'Expert en psychiatrie générale et en gestion des troubles de l’humeur. Le Dr. Petit propose des évaluations et un suivi pharmacologique si',
    price: '90€',
    imageUri: 'https://images.unsplash.com/photo-1555026903-888e2d424075?fit=crop&w=800&q=80',
  },
];

// --- Composant réutilisable pour la carte d'un professionnel ---
const ProfessionalCard = ({ professional }) => {
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons 
          key={i} 
          name={i <= rating ? 'star' : 'star-outline'} 
          size={16} 
          color="#FFD700" 
          style={styles.starIcon}
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image source={{ uri: professional.imageUri }} style={styles.profileImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{professional.name}</Text>
          <View style={styles.titleBadge}>
             <Text style={styles.titleText}>{professional.title}</Text>
          </View>
          {renderRating(professional.rating)}
          <Text style={styles.description}>{professional.description}</Text>
        </View>
      </View>
      
      <View style={styles.footerRow}>
        <Text style={styles.price}>{professional.price} / session</Text>
        <View style={styles.actionsContainer}>
          {/* Le bouton "Voir le profil" n'apparaît pas toujours sur la maquette, 
              mais est un bon "Should Have" pour l'expérience utilisateur */}
          <TouchableOpacity style={styles.viewProfileButton}>
            <Text style={styles.viewProfileText}>Voir le profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reserveButton}>
            <Text style={styles.reserveButtonText}>Réserver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- Composant principal ---
export default function FindProfessionalScreen() {
  return (
    <View style={styles.container}>
      {/* En-tête de page */}
      <Text style={styles.screenTitle}>Trouver un Professionnel</Text>
      <Text style={styles.mainTitle}>Nos professionnels recommandés</Text>
      
      <FlatList
        data={PROFESSIONALS_DATA}
        renderItem={({ item }) => <ProfessionalCard professional={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 50, // Pour compenser la zone de l'iPhone notch
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20, // Espace au bas de la liste
  },

  // Style de la carte individuelle
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000', // Ombre douce pour la profondeur
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30, // Image ronde
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  titleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0EAE9', // Fond du badge doux
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
    marginBottom: 5,
  },
  titleText: {
    fontSize: 12,
    color: '#7AC4AE',
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  starIcon: {
    marginRight: 1,
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginTop: 5,
  },

  // Actions de la carte
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  viewProfileButton: {
    borderWidth: 1,
    borderColor: '#7AC4AE',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#FFF', // Fond blanc
  },
  viewProfileText: {
    color: '#7AC4AE',
    fontWeight: '600',
    fontSize: 13,
  },
  reserveButton: {
    backgroundColor: '#00B349', // Couleur verte de réservation
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    justifyContent: 'center',
  },
  reserveButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
});