// screens/ActivitesEtVideosScreen.js
import { Ionicons } from '@expo/vector-icons'; // Pour l'icône de recherche
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// --- Données fictives pour la démo ---
const GUIDED_ACTIVITIES = [
  {
    id: '1',
    title: 'Flow de yoga restauratif pour la conscience du corps',
    duration: '20 min',
    rating: 4.8,
    reviews: 125,
    imageUri: 'https://images.unsplash.com/photo-1549417226-c4d32e9e2f49?fit=crop&w=800&q=80', // Remplacer par vos images
  },
  {
    id: '2',
    title: 'Méditation guidée pour le sommeil profond et réparateur',
    duration: '15 min',
    rating: 4.5,
    reviews: 98,
    imageUri: 'https://images.unsplash.com/photo-1598885408796-0a061b9a9f9d?fit=crop&w=800&q=80', // Remplacer par vos images
  },
];

const POPULAR_VIDEOS = [
  {
    id: 'v1',
    title: 'Gérer la pression des études: techniques et planification efficace',
    imageUri: 'https://images.unsplash.com/photo-1506744038136-460709778036?fit=crop&w=800&q=80', // Remplacer par vos images
  },
  {
    id: 'v2',
    title: 'Booster l\'empathie : techniques et exercices pour mieux s\'exprimer',
    imageUri: 'https://images.unsplash.com/photo-1522867824147-380afbe48e65?fit=crop&w=800&q=80', // Remplacer par vos images
  },
];

const RECENT_ARTICLES = [
  {
    id: 'a1',
    title: 'L\'importance de la gratitude dans notre bien-être',
    imageUri: 'https://images.unsplash.com/photo-1517841901174-880628236d80?fit=crop&w=800&q=80', // Remplacer par vos images
  },
  {
    id: 'a2',
    title: 'Marche en pleine nature : votre micro-habitude anti-stress',
    imageUri: 'https://images.unsplash.com/photo-1470240735366-22442469956d?fit=crop&w=800&q=80', // Remplacer par vos images
  },
];

// --- Composant principal ---

export default function ActivitesEtVideosScreen() {
  
  // Composant pour les filtres (Humeur, Stress, Énergie, etc.)
  const renderFilters = () => (
    <View style={styles.filterContainer}>
      {['Tout', 'Humeur', 'Stress', 'Énergie', 'Sommeil'].map(filter => (
        <TouchableOpacity 
          key={filter} 
          style={[styles.filterButton, filter === 'Tout' && styles.activeFilter]}
        >
          <Text style={[styles.filterText, filter === 'Tout' && styles.activeFilterText]}>{filter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Composant pour une carte d'activité guidée
  const renderActivityCard = (activity) => (
    <View key={activity.id} style={styles.activityCard}>
      <Image source={{ uri: activity.imageUri }} style={styles.activityImage} />
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <View style={styles.activityRating}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{activity.rating}</Text>
          <Text style={styles.reviewText}>({activity.reviews})</Text>
        </View>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Commencer l'activité</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Composant pour une carte Vidéo/Article
  const renderMediaCard = (item, type) => (
    <View key={item.id} style={styles.mediaCard}>
      <Image source={{ uri: item.imageUri }} style={styles.mediaImage} />
      <Text style={styles.mediaTitle}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      {/* Barre de recherche personnalisée */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une idée, une routine..."
          placeholderTextColor="#888"
        />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Filtres */}
        {renderFilters()}

        {/* --- Activités guidées --- */}
        <Text style={styles.sectionTitle}>Activités guidées</Text>
        {GUIDED_ACTIVITIES.map(renderActivityCard)}

        {/* --- Vidéos populaires --- */}
        <Text style={styles.sectionTitle}>Vidéos populaires</Text>
        {POPULAR_VIDEOS.map(video => renderMediaCard(video, 'video'))}

        {/* --- Articles récents --- */}
        <Text style={styles.sectionTitle}>Articles récents</Text>
        {RECENT_ARTICLES.map(article => renderMediaCard(article, 'article'))}

        {/* Espace pour ne pas coller au bas de l'écran */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 10, // Petit espace en haut
  },
  scrollContainer: {
    paddingHorizontal: 20, // Padding appliqué uniquement au contenu défilant
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0', // Fond gris clair pour le champ de recherche
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  
  // --- Filtres ---
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#EAEAEA', // Gris clair par défaut
  },
  activeFilter: {
    backgroundColor: '#7AC4AE', // Couleur principale de Mindly
  },
  filterText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#FFF',
  },

  // --- Titres de section ---
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },

  // --- Cartes d'activité guidée ---
  activityCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  activityImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  activityContent: {
    padding: 15,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  activityRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#888',
  },
  startButton: {
    backgroundColor: '#7AC4AE',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  startButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // --- Cartes Vidéo/Article ---
  mediaCard: {
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEE',
    paddingRight: 15,
  },
  mediaImage: {
    width: 100, // Largeur de l'image à gauche
    height: 100,
    resizeMode: 'cover',
    marginRight: 15,
  },
  mediaTitle: {
    flex: 1, // Permet au titre de prendre l'espace restant
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    alignSelf: 'center',
  }
});