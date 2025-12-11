// screens/DiscussionAnonymeScreen.js
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// --- Données fictives de la discussion ---
const initialMessages = [
  {
    id: '1',
    text: "Bonjour, comment vous sentez-vous aujourd'hui ? Je suis là pour écouter.",
    sender: 'OtherUser', // Représente un autre membre de la communauté
    alias: 'User 123',
    time: '10:00 AM',
  },
  {
    id: '2',
    text: 'Je me sens un peu dépassé en ce moment. J’ai eu une journée difficile.',
    sender: 'CurrentUser', // Représente l'utilisateur local
    alias: 'Moi',
    time: '10:01 AM',
  },
  {
    id: '3',
    text: 'Je comprends. C\'est courageux de votre part de partager cela. Voulez-vous en parler davantage ?',
    sender: 'OtherUser',
    alias: 'User 456',
    time: '10:02 AM',
  },
  {
    id: '4',
    text: 'Je suis juste stressé par le travail et j’ai du mal à trouver la motivation.',
    sender: 'CurrentUser',
    alias: 'Moi',
    time: '10:03 AM',
  },
  {
    id: '5',
    text: 'Le stress au travail est très courant. Avez-vous des stratégies pour vous détendre ou vous ressourcer ?',
    sender: 'OtherUser',
    alias: 'User 789',
    time: '10:04 AM',
  },
  {
    id: '6',
    text: "J'essaie de faire du sport, mais parfois c'est difficile de s'y mettre.",
    sender: 'CurrentUser',
    alias: 'Moi',
    time: '10:05 AM',
  },
  {
    id: '7',
    text: "Ça peut arriver, mais ne te décourage pas. Tu vas y arriver.",
    sender: 'OtherUser',
    alias: 'User 123',
    time: '10:06 AM',
  },
  {
    id: '8',
    text: "Merci. Ça fait du bien de pouvoir en parler sans jugement.",
    sender: 'CurrentUser',
    alias: 'Moi',
    time: '10:07 AM',
  },
  {
    id: '9',
    text: "C'est exactement le but de cet espace. N'hésitez jamais à vous exprimer ici.",
    sender: 'OtherUser',
    alias: 'User 456',
    time: '10:08 AM',
  },
  {
    id: '10',
    text: "Je vais essayer de me concentrer sur des activités apaisantes ce soir.",
    sender: 'CurrentUser',
    alias: 'Moi',
    time: '10:09 AM',
  },
];

// --- Composant de Bulle de Message Communautaire ---
const CommunityMessageBubble = ({ message }) => {
  const isCurrentUser = message.sender === 'CurrentUser';

  return (
    <View style={[
      styles.messageContainer,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        {/* L'alias est optionnel pour les messages anonymes, on l'ajoute si vous voulez le voir */}
        {/* {!isCurrentUser && <Text style={styles.aliasText}>{message.alias}</Text>} */}
        
        <Text style={isCurrentUser ? styles.currentUserText : styles.otherUserText}>
          {message.text}
        </Text>
        
        <Text style={isCurrentUser ? styles.currentUserTime : styles.otherUserTime}>
          {message.time}
        </Text>
      </View>
    </View>
  );
};

// --- Composant principal ---
export default function DiscussionAnonymeScreen({ navigation }) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');

  // Fonction pour simuler l'envoi de message
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'CurrentUser',
      alias: 'Moi',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prevMessages => [newMessage, ...prevMessages]); // Ajouter au début pour l'effet "inverted"
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.fullScreen}>
      <View style={styles.tabHeader}>
        {/* Ici on met les onglets Discussion, Professionnels, Rappels, Activités */}
        <Text style={[styles.tabText, styles.activeTab]}>Discussion Anonyme</Text>
      </View>
      <View style={styles.tabBarDivider} />

      <FlatList
        data={messages}
        renderItem={({ item }) => <CommunityMessageBubble message={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        inverted // Affiche les messages du bas vers le haut
      />

      {/* Zone de saisie */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Tapez votre message ici..."
            placeholderTextColor="#888"
            multiline={false}
          />
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={handleSendMessage}
            disabled={inputText.trim() === ''}
          >
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  
  // --- Header/Onglets (Simulés) ---
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  tabText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    paddingVertical: 5,
  },
  activeTab: {
    color: '#00B349',
    borderBottomWidth: 2,
    borderBottomColor: '#00B349',
  },
  tabBarDivider: {
    height: 1,
    backgroundColor: '#EEE',
    marginBottom: 5,
  },
  
  messageList: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },

  // --- Styles de bulle ---
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  
  bubble: {
    padding: 12,
    borderRadius: 15,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  otherUserBubble: {
    backgroundColor: '#F0F0F0', // Bulle claire pour les autres utilisateurs
    borderTopLeftRadius: 5, // Arrondi léger
  },
  currentUserBubble: {
    backgroundColor: '#00B349', // Bulle verte pour l'utilisateur
    borderTopRightRadius: 5,
  },
  
  // Texte et Heure
  aliasText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 2,
  },
  otherUserText: {
    fontSize: 15,
    color: '#333',
  },
  currentUserText: {
    fontSize: 15,
    color: '#FFF',
  },
  otherUserTime: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 5,
    opacity: 0.8,
  },
  currentUserTime: {
    fontSize: 10,
    color: '#FFF',
    alignSelf: 'flex-end',
    marginTop: 5,
    opacity: 0.8,
  },
  
  // --- Zone de Saisie ---
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100, 
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  sendButton: {
    backgroundColor: '#00B349',
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
