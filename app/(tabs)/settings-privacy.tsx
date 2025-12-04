import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsPrivacy() {
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [dataExport, setDataExport] = useState(false);
  const [importantTips, setImportantTips] = useState(true);
  const [shareData, setShareData] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Paramètres & Confidentialité</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Recevoir les notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Recevoir la newsletter</Text>
          <Switch value={newsletter} onValueChange={setNewsletter} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Confidentialité</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Profil privé</Text>
          <Switch value={privateProfile} onValueChange={setPrivateProfile} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Exporter mes données</Text>
          <Switch value={dataExport} onValueChange={setDataExport} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Afficher les conseils importants</Text>
          <Switch value={importantTips} onValueChange={setImportantTips} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Partager mes données anonymisées</Text>
          <Switch value={shareData} onValueChange={setShareData} />
        </View>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
    backgroundColor: '#f7f7fa',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: '#222',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
