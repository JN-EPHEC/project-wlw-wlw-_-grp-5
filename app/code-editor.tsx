import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
}

export default function CodeEditorPage() {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    try {
      const raw = await AsyncStorage.getItem('mindly-code-snippets');
      if (raw) setSnippets(JSON.parse(raw));
    } catch (e) {
      console.error('Erreur chargement snippets', e);
    }
  };

  const saveSnippets = async (next: Snippet[]) => {
    try {
      await AsyncStorage.setItem('mindly-code-snippets', JSON.stringify(next));
    } catch (e) {
      console.error('Erreur sauvegarde snippets', e);
    }
  };

  const addSnippet = async () => {
    if (!title.trim() || !code.trim()) {
      Alert.alert('Champs manquants', 'Donnez un titre et du code avant de sauvegarder.');
      return;
    }

    const newItem: Snippet = {
      id: Date.now().toString(),
      title: title.trim(),
      language: language.trim() || 'text',
      code: code,
      createdAt: new Date().toISOString()
    };

    const next = [newItem, ...snippets];
    setSnippets(next);
    await saveSnippets(next);
    setTitle('');
    setCode('');
    setLanguage('javascript');
    Alert.alert('Snippet sauvegardé', 'Votre extrait de code a été enregistré.');
  };

  const removeSnippet = (id: string) => {
    Alert.alert('Supprimer', "Supprimer cet extrait ?", [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        const next = snippets.filter(s => s.id !== id);
        setSnippets(next);
        await saveSnippets(next);
      } }
    ]);
  };

  const openSnippet = (s: Snippet) => {
    setTitle(s.title);
    setLanguage(s.language);
    setCode(s.code);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Éditeur de code</Text>
        <Text style={styles.subtitle}>Ajoute et sauvegarde des extraits de code</Text>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Titre</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="Titre du snippet" style={styles.input} />

        <Text style={styles.label}>Langage</Text>
        <TextInput value={language} onChangeText={setLanguage} placeholder="javascript | ts | css | html" style={styles.input} />

        <Text style={styles.label}>Code</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Colle ton code ici..."
          style={styles.codeInput}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={addSnippet}>
          <Text style={styles.saveBtnText}>Sauvegarder</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Extraits sauvegardés</Text>
        {snippets.length === 0 && <Text style={styles.empty}>Aucun extrait pour l'instant.</Text>}

        {snippets.map(s => (
          <View key={s.id} style={styles.snippetCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.snippetTitle}>{s.title}</Text>
              <Text style={styles.snippetMeta}>{s.language} • {new Date(s.createdAt).toLocaleString()}</Text>
              <Text numberOfLines={4} style={styles.snippetPreview}>{s.code}</Text>
            </View>
            <View style={styles.snippetActions}>
              <TouchableOpacity onPress={() => openSnippet(s)} style={styles.actionBtn}><Text style={styles.actionBtnText}>Ouvrir</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => removeSnippet(s.id)} style={[styles.actionBtn, { backgroundColor: '#ef4444' }]}><Text style={styles.actionBtnText}>Suppr.</Text></TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { alignItems: 'center', paddingTop: 50, paddingBottom: 20, backgroundColor: '#6b21a8', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { color: 'white', fontSize: 22, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  content: { padding: 16 },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 6, color: '#111827' },
  input: { backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  codeInput: { backgroundColor: '#0f172a', color: '#e6eef7', height: 160, borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 13, borderWidth: 1, borderColor: '#0b1220' },
  saveBtn: { marginTop: 12, backgroundColor: '#6b21a8', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  saveBtnText: { color: 'white', fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 10, color: '#111827' },
  empty: { color: '#6b7280', marginTop: 8 },
  snippetCard: { marginTop: 12, backgroundColor: 'white', borderRadius: 10, padding: 12, flexDirection: 'row', gap: 8, alignItems: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  snippetTitle: { fontWeight: '700', fontSize: 15 },
  snippetMeta: { color: '#6b7280', fontSize: 12, marginTop: 4 },
  snippetPreview: { color: '#111827', marginTop: 8 },
  snippetActions: { marginLeft: 12, justifyContent: 'space-between' },
  actionBtn: { backgroundColor: '#10b981', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginBottom: 6 },
  actionBtnText: { color: 'white', fontWeight: '700' }
});
