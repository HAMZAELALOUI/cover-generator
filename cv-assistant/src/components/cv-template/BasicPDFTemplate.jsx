import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: '20mm',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cvBadge: {
    backgroundColor: '#dc2626',
    padding: '8px 16px',
    color: 'white',
  },
  contactInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    color: '#4b5563',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  experienceItem: {
    marginBottom: 15,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  companyName: {
    color: '#4b5563',
  },
  bulletPoint: {
    marginLeft: 15,
    marginBottom: 3,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
  },
});

export default function PDFPreview({ cvData }) {
  if (!cvData) return null;

  return (
    <PDFViewer style={{ width: '100%', height: '800px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {cvData.personal_info?.name || 'YOUR NAME'}
            </Text>
            <View style={styles.cvBadge}>
              <Text>CV</Text>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.contactInfo}>
            <Text>📍 {cvData.personal_info?.location}</Text>
            <Text>📞 {cvData.personal_info?.phone}</Text>
            <Text>✉️ {cvData.personal_info?.email}</Text>
          </View>

          {/* Profile */}
          <View style={styles.section}>
            <Text style={styles.text}>{cvData.profil}</Text>
          </View>

          {/* Work Experience */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {cvData.experience_professionnelle?.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={{ fontWeight: 'bold' }}>{exp.poste}</Text>
                  <Text>{exp.periode}</Text>
                </View>
                <Text style={styles.companyName}>{exp.entreprise}</Text>
                {exp.realisations?.map((item, idx) => (
                  <Text key={idx} style={styles.bulletPoint}>
                    • {item}
                  </Text>
                ))}
              </View>
            ))}
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <Text style={styles.text}>
              {cvData.competences?.techniques?.join(', ')}
            </Text>
          </View>

          {/* Languages */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={styles.text}>
              {Object.entries(cvData.personal_info?.languages || {})
                .map(([lang, level]) => `${lang}: ${level}`)
                .join(', ')}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
