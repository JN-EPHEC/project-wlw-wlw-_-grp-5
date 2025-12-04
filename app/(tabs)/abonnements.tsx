// screens/PremiumSubscriptionScreen.js
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// --- Composant pour une ligne d'avantage (Checkmark) ---
const BenefitLine = ({ text, color }) => (
  <View style={styles.benefitRow}>
    <Ionicons name="checkmark-circle" size={18} color={color || '#00B349'} style={styles.checkmarkIcon} />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

// --- Composant de Plan Tarifaire ---
const PricingCard = ({ 
  title, 
  priceMonthly, 
  priceAnnual, 
  benefits, 
  isAnnual, 
  isSelected, 
  onSelect 
}) => {
  
  const cardStyle = isAnnual && isSelected ? styles.selectedAnnualCard : styles.pricingCard;
  const titleColor = isAnnual ? styles.annualTitle : styles.monthlyTitle;

  return (
    <TouchableOpacity style={cardStyle} onPress={onSelect}>
      <View style={styles.planHeader}>
        <Text style={[styles.planTitle, titleColor]}>{title}</Text>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>
          {isAnnual ? priceAnnual : priceMonthly}
        </Text>
        <Text style={styles.perText}>{isAnnual ? '/ an' : '/ mois'}</Text>
      </View>
      
      <View style={styles.benefitsContainer}>
        {benefits.map((benefit, index) => (
          <BenefitLine key={index} text={benefit} />
        ))}
      </View>

      <TouchableOpacity 
        style={isSelected ? styles.selectedButton : styles.unselectedButton}
        onPress={onSelect}
      >
        <Text style={styles.buttonText}>
          {isSelected ? 'Plan sélectionné' : 'Choisir ce plan'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// --- Composant principal ---
export default function PremiumSubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState('annual'); // 'monthly' ou 'annual'

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* 1. Bloc de promotion (Débloquez le potentiel Premium) */}
      <View style={styles.promoBox}>
        <Ionicons name="gift" size={40} color="#7AC4AE" style={styles.giftIcon} />
        <Text style={styles.promoTitle}>Débloquez le potentiel Premium</Text>
        <Text style={styles.promoSubtitle}>
          Accédez à des fonctionnalités exclusives, une expérience sans publicité et un support prioritaire.
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Choisissez votre plan</Text>

      {/* 2. Plan Mensuel */}
      <PricingCard
        title="Plan Mensuel étudiant/adulte"
        priceMonthly="2,99€/7,99€"
        benefits={[
          "Accès complet aux fonctionnalités Premium",
          "Annulable à tout moment",
        ]}
        isAnnual={false}
        isSelected={selectedPlan === 'monthly'}
        onSelect={() => setSelectedPlan('monthly')}
      />

      {/* 3. Plan Annuel (Mis en évidence) */}
      <PricingCard
        title="Plan Annuel"
        priceAnnual="29,99€/79,99€"
        benefits={[
          "Accès complet aux fonctionnalités Premium",
          "2 mois offerts chaque année",
          "Facturation annuelle unique",
        ]}
        isAnnual={true}
        isSelected={selectedPlan === 'annual'}
        onSelect={() => setSelectedPlan('annual')}
      />
      
      <Text style={styles.sectionHeader}>Méthode de paiement</Text>

      {/* 4. Méthode de paiement */}
      <View style={styles.paymentMethodContainer}>
        <View style={styles.paymentOption}>
          <Ionicons name="card-outline" size={24} color="#333" />
          <Text style={styles.paymentText}>Carte bancaire</Text>
          <Ionicons name="checkmark-circle" size={20} color="#00B349" style={styles.selectedPaymentIcon} />
        </View>
        <View style={[styles.paymentOption, styles.lastPaymentOption]}>
          <Ionicons name="logo-paypal" size={24} color="#333" />
          <Text style={styles.paymentText}>PayPal</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Résumé</Text>

      {/* 5. Résumé de la commande */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Votre plan sélectionné</Text>
          <Text style={styles.summaryValue}>
            {selectedPlan === 'annual' ? '79,99€ / an' : '7,99€ / mois'}
          </Text>
        </View>
        <Text style={styles.summaryNote}>
          Votre abonnement sera automatiquement renouvelé. Vous pouvez le gérer dans les paramètres de votre compte.
        </Text>
      </View>

      {/* 6. Bouton de Paiement Final */}
      <TouchableOpacity style={styles.finalPayButton}>
        <Text style={styles.finalPayButtonText}>Payer 89,99€ en toute sécurité</Text>
      </TouchableOpacity>
      
      <View style={{ height: 40 }} /> {/* Espace sous le bouton de paiement */}
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
  
  // --- En-tête de la page ---
  promoBox: {
    backgroundColor: '#E6F4E6', // Vert très clair
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  giftIcon: {
    marginBottom: 10,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  
  // --- Cartes de prix ---
  pricingCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  selectedAnnualCard: {
    backgroundColor: '#E6F4E6', // Fond vert clair pour la sélection annuelle
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00B349', // Bordure verte foncée
  },
  planHeader: {
    marginBottom: 15,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  perText: {
    fontSize: 16,
    color: '#555',
  },
  
  // Avantages (Checkmarks)
  benefitsContainer: {
    marginBottom: 20,
    paddingLeft: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmarkIcon: {
    marginRight: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#555',
  },
  
  // Boutons de sélection
  unselectedButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#7AC4AE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#00B349', // Bouton vert foncé
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // --- Méthode de paiement ---
  paymentMethodContainer: {
    marginBottom: 30,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#7AC4AE', // Bordure verte pour la sélection
  },
  lastPaymentOption: {
    borderBottomWidth: 0,
    marginTop: 10,
    borderColor: '#EAEAEA', // Bordure grise pour la non-sélection
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  selectedPaymentIcon: {
    marginLeft: 'auto',
  },

  // --- Résumé ---
  summaryBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#555',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryNote: {
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },

  // --- Bouton de Paiement Final ---
  finalPayButton: {
    backgroundColor: '#00B349',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  finalPayButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});