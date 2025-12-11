// screens/SupportTechniqueScreen.js
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// --- Composant principal ---
export default function SupportTechniqueScreen({ navigation }) {
  const [message, setMessage] = useState('');
  
  // Fonction de simulation d'envoi du message
  const handleSendMessage = () => {
    if (message.trim() === '') {
      alert("Veuillez décrire votre problème.");
      return;
    }
    // Ici, vous intégreriez la logique pour envoyer le message à votre backend (Zendesk, email, etc.)
    alert(`Message envoyé ! Nous vous répondrons dès que possible.`);
    setMessage('');
  };

  // Fonction pour naviguer vers l'assistance automatisée (MindSafe Chat)
  const navigateToBot = () => {
    // Dans votre navigation réelle, cela pourrait être :
    // navigation.navigate('MindSafeChat');
    alert("Redirection vers l'Assistant Virtuel MindSafe...");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Support Technique</Text>

        {/* --- Bloc 'Nous Contacter' (Formulaire) --- */}
        <View style={styles.contactCard}>
          <Text style={styles.cardTitle}>Nous Contacter</Text>
          <Text style={styles.cardText}>
            Vous avez un problème avec l'application, quelque chose ne fonctionne pas, envoyez-nous un message et on essayera de le résoudre au plus vite.
          </Text>

          <Text style={styles.inputLabel}>Votre Message</Text>
          <TextInput
            style={styles.messageInput}
            onChangeText={setMessage}
            value={message}
            placeholder="Décrivez votre problème ou question..."
            placeholderTextColor="#888"
            multiline={true}
            numberOfLines={4}
          />
          
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Envoyer le Message</Text>
          </TouchableOpacity>
        </View>

        {/* --- Bloc 'Assistance Automatisée' (Chatbot) --- */}
        <Text style={styles.subSectionTitle}>Assistance Automatisée</Text>
        <View style={styles.botCard}>
          <View style={styles.botRow}>
            {/* Simulation de l'icône du bot */}
            <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/866/866236.png' }} // Remplacer par l'image de votre bot
                style={styles.botIcon} 
            />
            <Text style={styles.botText}>
              Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?
            </Text>
          </View>
          
          <TouchableOpacity style={styles.botButton} onPress={navigateToBot}>
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 30 }} /> 
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Fond gris clair de la maquette
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },

  // --- Style de la carte de contact ---
  contactCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  messageInput: {
    minHeight: 120,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    fontSize: 15,
    color: '#333',
    textAlignVertical: 'top', // Pour que le texte commence en haut
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  sendButton: {
    backgroundColor: '#00B349', // Couleur verte Mindly
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // --- Style de l'assistance automatisée ---
  subSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  botCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  botRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  botIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
    backgroundColor: '#EAEAEA',
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  botText: {
    fontSize: 14,
    color: '#555',
    flexShrink: 1,
  },
  botButton: {
    backgroundColor: '#00B349',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});