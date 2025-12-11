// screens/HelpAndResourcesScreen.js
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// --- Composant pour un numéro d'urgence (Police, Pompiers, etc.) ---
const EmergencyContact = ({ title, description, number, iconName }) => {
  const handleCall = () => {
    // Utilise l'API Linking pour ouvrir l'application d'appel
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.emergencyCard}>
      <View style={styles.contactInfo}>
        <Ionicons name={iconName} size={20} color="#00B349" style={styles.contactIcon} />
        <Text style={styles.contactTitle}>{title}</Text>
      </View>
      <Text style={styles.contactDescription}>{description}</Text>
      <TouchableOpacity style={styles.callButton} onPress={handleCall}>
        <Ionicons name="call" size={20} color="#FFF" style={{ marginRight: 10 }} />
        <Text style={styles.callButtonText}>{number}</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Composant pour une association/ressource externe ---
const AssociationCard = ({ title, description, url, buttonText }) => {
  const handleOpenLink = () => {
    Linking.openURL(url).catch(err => console.error("Erreur d'ouverture de lien:", err));
  };

  return (
    <View style={styles.associationCard}>
      <Text style={styles.associationTitle}>{title}</Text>
      <Text style={styles.associationDescription}>{description}</Text>
      <TouchableOpacity style={styles.visitButton} onPress={handleOpenLink}>
        <Ionicons name="open-outline" size={18} color="#7AC4AE" style={{ marginRight: 10 }} />
        <Text style={styles.visitButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Composant pour la FAQ dépliable ---
const FAQItem = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <View style={styles.faqItem}>
      <TouchableOpacity style={styles.faqHeader} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Ionicons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#333" 
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqBody}>
          <Text style={styles.faqAnswer}>{answer}</Text>
        </View>
      )}
    </View>
  );
};


// --- Composant principal ---
export default function HelpAndResourcesScreen() {
  
  // Données de la FAQ
  const faqData = [
    { question: 'Comment réinitialiser mon mot de passe ?', answer: 'Allez dans les paramètres de votre profil, cliquez sur "Sécurité" puis "Changer le mot de passe".' },
    { question: 'Mon application est lente, que faire ?', answer: 'Essayez de vider le cache de l\'application dans les réglages de votre téléphone ou assurez-vous que vous avez la dernière version.' },
    { question: 'Comment mettre à jour mes informations personnelles ?', answer: 'Toutes vos informations peuvent être modifiées dans l\'onglet "Profil" de l\'application.' },
    { question: 'Je n’arrive pas à me connecter, mon compte est-il bloqué ?', answer: 'Si vous avez essayé de vous connecter trop de fois, votre compte peut être temporairement bloqué. Contactez le support client ci-dessous.' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Aide & Ressources</Text>

      {/* --- 1. Numéros d'Urgence --- */}
      <Text style={styles.sectionHeader}>Numéros d'Urgence</Text>
      <EmergencyContact 
        title="Police / Urgences"
        description="Pour toute urgence policière ou situation critique nécessitant une intervention immédiate."
        number="101"
        iconName="shield-half-outline"
      />
      <EmergencyContact 
        title="Pompiers / Ambulance"
        description="En cas d'incendie, d'accident grave ou d'urgence médicale nécessitant une ambulance."
        number="112"
        iconName="flame-outline"
      />
      <EmergencyContact 
        title="Centre Antipoison"
        description="Pour des conseils en cas d'empoisonnement ou d'intoxication."
        number="070 245 245"
        iconName="medkit-outline"
      />
      
      {/* --- 2. Associations Belges --- */}
      <Text style={styles.sectionHeader}>Associations Belges</Text>
      <AssociationCard
        title="Télé-Accueil"
        description="Service d'écoute gratuit, anonyme et 24h/24 pour toute personne en détresse."
        url="https://www.tele-accueil.be" // Remplacez par le vrai lien
        buttonText="Visiter Télé-Accueil"
      />
      <AssociationCard
        title="PsyForYou"
        description="Plateforme de mise en relation avec des professionnels de la santé mentale en Belgique."
        url="https://www.psyforyou.be" // Remplacez par le vrai lien
        buttonText="Visiter PsyForYou"
      />

      {/* --- 3. FAQ Technique --- */}
      <Text style={styles.sectionHeader}>FAQ Technique</Text>
      <View style={styles.faqContainer}>
        {faqData.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </View>

      {/* --- 4. Support Client --- */}
      <Text style={styles.sectionHeader}>Support Client</Text>
      <View style={styles.supportCard}>
        <Text style={styles.supportText}>
          Contactez notre équipe de support pour toute question ou problème technique.
        </Text>
        <TouchableOpacity style={styles.emailButton} onPress={() => Linking.openURL('mailto:support@mindlyapp.com')}>
          <Ionicons name="mail-outline" size={20} color="#00B349" style={{ marginRight: 10 }} />
          <Text style={styles.emailButtonText}>Envoyer un e-mail</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  
  // --- 1. Numéros d'Urgence Styles ---
  emergencyCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#00B349',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  contactIcon: {
    marginRight: 10,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactDescription: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
  },
  callButton: {
    backgroundColor: '#00B349',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // --- 2. Associations Styles ---
  associationCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  associationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  associationDescription: {
    fontSize: 13,
    color: '#555',
    marginBottom: 15,
  },
  visitButton: {
    borderWidth: 1,
    borderColor: '#7AC4AE',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitButtonText: {
    color: '#7AC4AE',
    fontSize: 14,
    fontWeight: '600',
  },

  // --- 3. FAQ Styles ---
  faqContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  faqBody: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#555',
  },

  // --- 4. Support Client Styles ---
  supportCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
  },
  supportText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  emailButton: {
    borderWidth: 1,
    borderColor: '#00B349',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  emailButtonText: {
    color: '#00B349',
    fontSize: 15,
    fontWeight: 'bold',
  },
});