import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadChatHistory();
    // Message de bienvenue
    if (messages.length === 0) {
      addWelcomeMessage();
    }
  }, []);

  const loadChatHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('mindly-chat-history');
      if (stored) {
        const history = JSON.parse(stored);
        setMessages(history.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  };

  const saveChatHistory = async (newMessages: ChatMessage[]) => {
    try {
      await AsyncStorage.setItem('mindly-chat-history', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      text: "Bonjour ! Je suis MindSafe, votre compagnon IA bienveillant. Je suis là pour vous écouter sans jugement et vous accompagner dans votre bien-être émotionnel. Comment vous sentez-vous aujourd'hui ?",
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    
    // Simulation de l'IA qui tape
    setIsTyping(true);
    
    // Simuler une réponse après un délai
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.text);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      setIsTyping(false);
      saveChatHistory(updatedMessages);
    }, 1500 + Math.random() * 1500); // Entre 1.5 et 3 secondes
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Détection de crise
    const crisisKeywords = ['suicide', 'mourir', 'me tuer', 'plus envie', 'fini', 'bout du rouleau'];
    if (crisisKeywords.some(keyword => input.includes(keyword))) {
      return "Je vois que vous traversez une période très difficile. Votre vie a de la valeur et il existe de l'aide. En urgence, contactez le 3114 (numéro national français de prévention du suicide, gratuit, 24h/24). Vous pouvez aussi appeler SOS Amitié au 09 72 39 40 50. Voulez-vous que nous parlions de ce qui vous préoccupe ?";
    }

    // Réponses empathiques basées sur le contenu
    if (input.includes('stress') || input.includes('anxieux') || input.includes('angoisse')) {
      return "Je comprends que vous ressentez du stress. C'est une réaction normale face aux défis de la vie. Essayons ensemble un exercice de respiration : inspirez lentement pendant 4 secondes, retenez pendant 4 secondes, puis expirez pendant 6 secondes. Répétez 3 fois. Comment vous sentez-vous maintenant ?";
    }

    if (input.includes('triste') || input.includes('déprim') || input.includes('bas')) {
      return "Je vois que vous vous sentez triste. Ces émotions sont légitimes et il est important de les accueillir. Rappelez-vous que les émotions sont temporaires, même si elles semblent intenses maintenant. Qu'est-ce qui vous a aidé dans le passé quand vous vous sentiez ainsi ?";
    }

    if (input.includes('fatigué') || input.includes('épuisé') || input.includes('sommeil')) {
      return "La fatigue peut affecter notre bien-être émotionnel. Avez-vous pu prendre du temps pour vous reposer récemment ? Il est important d'écouter les besoins de votre corps. Même 10 minutes de pause peuvent faire la différence.";
    }

    if (input.includes('travail') || input.includes('boulot') || input.includes('job')) {
      return "Les questions professionnelles peuvent être sources de préoccupations. Il est normal de se sentir parfois dépassé. Qu'est-ce qui vous préoccupe le plus dans votre situation professionnelle actuelle ?";
    }

    if (input.includes('relation') || input.includes('couple') || input.includes('ami')) {
      return "Les relations humaines sont complexes et précieuses. Il est naturel d'avoir des questionnements ou des difficultés relationnelles. Voulez-vous me parler de ce qui vous préoccupe dans vos relations ?";
    }

    // Réponses positives
    if (input.includes('bien') || input.includes('mieux') || input.includes('content') || input.includes('heureux')) {
      return "C'est merveilleux d'entendre que vous vous sentez bien ! Ces moments positifs sont précieux. Qu'est-ce qui contribue à ce bien-être aujourd'hui ? Il peut être utile de noter ces éléments pour s'en souvenir dans les moments plus difficiles.";
    }

    // Réponse générale empathique
    const generalResponses = [
      "Je vous écoute attentivement. Pouvez-vous me parler davantage de ce que vous ressentez ?",
      "Merci de partager cela avec moi. Vos sentiments sont importants et légitimes. Comment puis-je vous accompagner ?",
      "Je comprends que cette situation puisse être difficile pour vous. Vous n'êtes pas seul(e). Voulez-vous explorer ensemble ce qui pourrait vous aider ?",
      "Il est courageux de votre part de parler de ce que vous vivez. Prenez le temps qu'il vous faut pour m'expliquer votre situation.",
      "Je suis là pour vous écouter sans jugement. Qu'est-ce qui vous préoccupe le plus en ce moment ?"
    ];

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const sendQuickMessage = (message: string) => {
    setInputText(message);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>MindSafe</Text>
        <Text style={styles.subtitle}>Compagnon IA bienveillant</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && (
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Comment puis-je vous aider ?</Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => sendQuickMessage("J'ai besoin de conseils")}
            >
              <Text style={styles.actionEmoji}>💡</Text>
              <Text style={styles.actionText}>J'ai besoin de conseils</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => sendQuickMessage("Je me sens stressé(e)")}
            >
              <Text style={styles.actionEmoji}>😰</Text>
              <Text style={styles.actionText}>Je me sens stressé(e)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => sendQuickMessage("Peux-tu me guider dans un exercice de respiration ?")}
            >
              <Text style={styles.actionEmoji}>🌸</Text>
              <Text style={styles.actionText}>Exercice de respiration</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => sendQuickMessage("Je voudrais parler de ce que je ressens")}
            >
              <Text style={styles.actionEmoji}>💬</Text>
              <Text style={styles.actionText}>Parler librement</Text>
            </TouchableOpacity>
          </View>
        )}

        {messages.map((message) => (
          <View 
            key={message.id} 
            style={[
              styles.messageCard,
              message.isUser ? styles.userMessage : styles.aiMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.isUser ? styles.userMessageText : styles.aiMessageText
            ]}>
              {message.text}
            </Text>
            <Text style={styles.messageTime}>
              {message.timestamp.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageCard, styles.aiMessage]}>
            <Text style={styles.typingText}>MindSafe écrit...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Écrivez votre message..."
          placeholderTextColor="#999"
          multiline
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.safety}>
        <Text style={styles.safetyText}>
          🔒 Vos conversations sont privées et sécurisées
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#6366f1',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  quickActions: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 3,
  },
  actionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  messageCard: {
    marginVertical: 5,
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: '#6366f1',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 5,
    opacity: 0.7,
  },
  typingText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#6366f1',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  safety: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  safetyText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    textAlign: 'center',
  },
});