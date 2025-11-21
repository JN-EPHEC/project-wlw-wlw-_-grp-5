import { useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [activePage, setActivePage] = useState('Accueil');
  const fadeAnim = new Animated.Value(1);

  const handleNavigation = (page) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setActivePage(page));
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Accueil':
        return (
          <View style={styles.pageContent}>
            <Text style={styles.pageTitle}>Bienvenue sur MINDLY</Text>
            <Text style={styles.pageText}>Votre application de bien-être féminin.</Text>
          </View>
        );
      case 'Humeur':
        return (
          <View style={styles.pageContent}>
            <Text style={styles.pageTitle}>Humeur</Text>
            <Text style={styles.pageText}>Suivez et améliorez votre humeur quotidienne.</Text>
          </View>
        );
      case 'Communauté':
        return (
          <View style={styles.pageContent}>
            <Text style={styles.pageTitle}>Communauté</Text>
            <Text style={styles.pageText}>Rejoignez une communauté bienveillante.</Text>
          </View>
        );
      case 'Profil':
        return (
          <View style={styles.pageContent}>
            <Text style={styles.pageTitle}>Profil</Text>
            <Text style={styles.pageText}>Gérez vos informations personnelles.</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1, width: '100%' }}>
        {renderContent()}
      </Animated.View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Accueil')}>
          <Text style={[styles.navText, activePage === 'Accueil' && styles.activeNavText]}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Humeur')}>
          <Text style={[styles.navText, activePage === 'Humeur' && styles.activeNavText]}>Humeur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Communauté')}>
          <Text style={[styles.navText, activePage === 'Communauté' && styles.activeNavText]}>Communauté</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigation('Profil')}>
          <Text style={[styles.navText, activePage === 'Profil' && styles.activeNavText]}>Profil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pageContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  pageText: {
    fontSize: 16,
    color: '#E8F5E9',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#388E3C',
    padding: 10,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  activeNavText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});