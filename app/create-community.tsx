import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    Clipboard,
    Image,
    SafeAreaView,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { communityStore } from '../data/communityStore';
import { mockCommunities, mockPrivateChats } from '../data/discussions';

interface Member {
  id: string;
  name: string;
  profileImage: string;
}

export default function CreateCommunityScreen() {
  const router = useRouter();
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  // Convertir les chats prives en membres potentiels
  const availableMembers: Member[] = mockPrivateChats
    .filter(chat => !chat.isPending)
    .map(chat => ({
      id: chat.id,
      name: chat.contactName,
      profileImage: chat.profileImage,
    }));

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission refusee', 'Vous devez autoriser l acces a la galerie pour choisir une photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCoverImage(result.assets[0].uri);
    }
  };

  const handleCreateCommunity = () => {
    if (!communityName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un nom de communaute');
      return;
    }

    try {
      const inviteCode = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const generatedLink = `https://app.wellnesshub.com/join/${inviteCode}`;
      setInviteLink(generatedLink);
      
      const selectedMembersData = availableMembers.filter(m => selectedMembers.includes(m.id));
      const creator: Member = { id: 'me', name: 'Moi', profileImage: 'https://i.pravatar.cc/150?img=64' };
      const allMembers = [creator, ...selectedMembersData];
      const newCommunity = {
        id: inviteCode,
        name: communityName,
        coverImage: coverImage,
        memberCount: `${allMembers.length} membres`,
        activityStatus: 'Vient d etre creee',
        members: allMembers,
        description: description,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      
      communityStore.addCommunity(newCommunity);
      Clipboard.setString(generatedLink);
      router.replace({ pathname: '/chat/[id]', params: { id: inviteCode, type: 'community', name: communityName } });
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la creation de la communaute');
    }
  };

  const handleShareToContacts = async () => {
    const message = `Rejoins ma communaute "${communityName}" !\n\n${description}\n\nClique sur ce lien pour nous rejoindre :\n${inviteLink}`;

    try {
      await Share.share({
        message: message,
        title: `Invitation - ${communityName}`,
      });
    } catch (error) {
      console.error('Erreur de partage:', error);
    }
  };

  const handleShareToCommunity = (communityId: string, targetCommunityName: string) => {
    const message = `Nouvelle communaute creee !\n\n"${communityName}"\n${description}\n\nRejoignez-nous : ${inviteLink}`;
    
    Alert.alert(
      'Lien partage',
      `L invitation a ete envoyee dans "${targetCommunityName}".`,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowShareOptions(false);
            const code = inviteLink.split('/').pop() || '';
            router.replace({ pathname: '/chat/[id]', params: { id: code, type: 'community', name: communityName } });
          },
        },
      ]
    );
  };

  if (showShareOptions) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowShareOptions(false)} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Partager l invitation</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LIEN D INVITATION</Text>
            <View style={styles.linkCard}>
              <Text style={styles.linkLabel}>Lien de la communaute</Text>
              <View style={styles.linkContainer}>
                <Text style={styles.linkText} numberOfLines={1}>{inviteLink}</Text>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  Clipboard.setString(inviteLink);
                  Alert.alert('Copie', 'Le lien a ete copie dans le presse-papiers');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.copyButtonText}>Copier le lien</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PARTAGER PAR MESSAGE</Text>
            <TouchableOpacity
              style={styles.shareOptionCard}
              onPress={handleShareToContacts}
              activeOpacity={0.7}
            >
              <View style={styles.shareOptionIcon}>
                <Text style={styles.shareOptionIconText}>✉</Text>
              </View>
              <View style={styles.shareOptionContent}>
                <Text style={styles.shareOptionTitle}>Envoyer a des contacts</Text>
                <Text style={styles.shareOptionSubtitle}>
                  Partager via message, email, etc.
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PARTAGER DANS VOS COMMUNAUTES</Text>
            {mockCommunities.map(community => (
              <TouchableOpacity
                key={community.id}
                style={styles.communityCard}
                onPress={() => handleShareToCommunity(community.id, community.name)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: community.coverImage }}
                  style={styles.communityThumbnail}
                  resizeMode="cover"
                />
                <View style={styles.communityInfo}>
                  <Text style={styles.communityName} numberOfLines={1}>
                    {community.name}
                  </Text>
                  <Text style={styles.communityMembers} numberOfLines={1}>
                    {community.memberCount}
                  </Text>
                </View>
                <Text style={styles.sendIcon}>{'>'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.replace('/(tabs)/discussions')}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Terminer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.replace('/(tabs)/discussions')} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle communaute</Text>
        <TouchableOpacity
          onPress={handleCreateCommunity}
          disabled={!communityName.trim()}
          style={[styles.headerRight, { backgroundColor: communityName.trim() ? '#EFF6FF' : 'transparent' }]}
          activeOpacity={0.6}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text style={[styles.createText, !communityName.trim() && styles.createTextDisabled]}>
            Creer
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PHOTO DE COUVERTURE</Text>
          <View style={styles.imagePickerWrapper}>
            <Image
              source={{ uri: coverImage }}
              style={styles.coverImagePreview}
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={styles.imagePickerButton}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              <Text style={styles.imagePickerIcon}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom de la communaute *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Developpeurs React Native"
              placeholderTextColor="#9CA3AF"
              value={communityName}
              onChangeText={setCommunityName}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Decrivez votre communaute..."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tags (separes par des virgules)</Text>
            <TextInput
              style={styles.input}
              placeholder="bien-etre, meditation, routine"
              placeholderTextColor="#9CA3AF"
              value={tags}
              onChangeText={setTags}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AJOUTER DES MEMBRES</Text>
            <Text style={styles.sectionSubtitle}>
              {selectedMembers.length} selectionne{selectedMembers.length > 1 ? 's' : ''}
            </Text>
          </View>

          {availableMembers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Aucun contact disponible.
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Commencez des discussions pour ajouter des membres.
              </Text>
            </View>
          ) : (
            availableMembers.map(member => (
              <TouchableOpacity
                key={member.id}
                style={styles.memberCard}
                onPress={() => toggleMember(member.id)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: member.profileImage }}
                  style={styles.memberAvatar}
                />
                <Text style={styles.memberName}>{member.name}</Text>
                <View style={[
                  styles.checkbox,
                  selectedMembers.includes(member.id) && styles.checkboxSelected
                ]}>
                  {selectedMembers.includes(member.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#3B82F6',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    minWidth: 60,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  createText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  createTextDisabled: {
    color: '#D1D5DB',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  inputGroup: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  memberName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  shareOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  shareOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shareOptionIconText: {
    fontSize: 24,
  },
  shareOptionContent: {
    flex: 1,
  },
  shareOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  shareOptionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  communityThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  communityMembers: {
    fontSize: 13,
    color: '#6B7280',
  },
  sendIcon: {
    fontSize: 20,
    color: '#3B82F6',
  },
  linkCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  linkContainer: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 13,
    color: '#3B82F6',
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  skipButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  spacer: {
    height: 40,
  },
  imagePickerWrapper: {
    marginHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  coverImagePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
  },
  imagePickerButton: {
    position: 'absolute',
    bottom: 0,
    right: '50%',
    marginRight: -70,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagePickerIcon: {
    fontSize: 20,
  },
});
