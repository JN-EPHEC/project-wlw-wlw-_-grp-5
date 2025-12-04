// screens/RemindersScreen.js
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// --- Données d'état initiales des rappels ---
const initialReminders = [
  {
    id: '1',
    title: 'Check-in Émotionnel Quotidien',
    time: '20:00',
    description: 'Ne manquez pas votre point quotidien avec vous-même.',
    isActive: true,
  },
  {
    id: '2',
    title: 'Routine Matinale',
    time: '08:30',
    description: 'Faites votre micro-action de concentration.',
    isActive: false,
  },
  {
    id: '3',
    title: 'Méditation du Soir',
    time: '22:00',
    description: 'Un audio de 10 minutes pour préparer le sommeil.',
    isActive: true,
  },
  {
    id: '4',
    title: 'Conseils MindSafe',
    time: '14:00',
    description: 'Un conseil personnalisé basé sur votre humeur.',
    isActive: true,
  },
];

// --- Composant pour l'interrupteur ON/OFF ---
// Remarque: Le composant Switch est stylisé pour correspondre au vert de Mindly
const CustomSwitch = ({ value, onValueChange }) => (
  <Switch
    trackColor={{ false: "#EAEAEA", true: "#7AC4AE" }} // Couleur de la piste (fond)
    thumbColor={value ? "#FFF" : "#F4F3F4"} // Couleur du cercle (poignée)
    ios_backgroundColor="#EAEAEA"
    onValueChange={onValueChange}
    value={value}
  />
);

// --- Composant pour une ligne de rappel ---
const ReminderItem = ({ reminder, onToggle }) => (
  <View style={styles.reminderCard}>
    <View style={styles.textContainer}>
      <View style={styles.titleRow}>
        <Ionicons name="alarm-outline" size={20} color="#7AC4AE" style={{ marginRight: 8 }} />
        <Text style={styles.titleText}>{reminder.title}</Text>
      </View>
      
      <Text style={styles.descriptionText}>{reminder.description}</Text>
      <Text style={styles.timeText}>{reminder.time}</Text>
    </View>
    
    <CustomSwitch 
      value={reminder.isActive} 
      onValueChange={() => onToggle(reminder.id)} 
    />
  </View>
);


// --- Composant principal ---
export default function RemindersScreen() {
  const [reminders, setReminders] = useState(initialReminders);

  // Fonction pour activer/désactiver un rappel
  const handleToggleReminder = (id) => {
    setReminders(prevReminders =>
      prevReminders.map(rem =>
        rem.id === id ? { ...rem, isActive: !rem.isActive } : rem
      )
    );
  };
  
  // Fonction de simulation pour ajouter un nouveau rappel
  const handleAddNewReminder = () => {
    // Dans une vraie application, cela ouvrirait une modale/nouvelle page
    // pour choisir le type, l'heure, et la description.
    alert("Ajouter un rappel : Fonctionnalité non codée. Ouvrirait une nouvelle page.");
  };

  return (
    <View style={styles.container}>
      {/* En-tête de page */}
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Vos Rappels</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNewReminder}>
          <Ionicons name="add" size={28} color="#7AC4AE" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={reminders}
        renderItem={({ item }) => <ReminderItem reminder={item} onToggle={handleToggleReminder} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Bouton permanent "Ajouter un Rappel" (alternative au bouton d'en-tête) */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleAddNewReminder}>
        <Text style={styles.floatingButtonText}>+ Ajouter un nouveau rappel</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 50, // Pour compenser la zone de l'iPhone notch
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Espace pour le bouton flottant
  },

  // Style de la carte individuelle
  reminderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#7AC4AE', // Barre de couleur Mindly
    minHeight: 80,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  descriptionText: {
    fontSize: 13,
    color: '#555',
  },
  timeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7AC4AE',
    marginTop: 5,
  },
  
  // Style du bouton flottant d'ajout
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#7AC4AE',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});