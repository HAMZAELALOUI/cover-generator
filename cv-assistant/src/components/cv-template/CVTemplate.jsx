import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import Button from '../common/Button';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    fontSize: 10,
    color: '#4b5563',
  },
  skill: {
    backgroundColor: '#dbeafe',
    padding: '4 8',
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 4,
    fontSize: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  experienceItem: {
    marginBottom: 10,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    color: '#374151',
  }
});

export default function CVTemplate({ cvData }) {
  if (!cvData) return null;

  return (
    <div className="h-screen">
      <PDFViewer className="w-full h-full">
        <Document>
          <Page size="A4" style={styles.page}>
            {/* Header */}
            <Text style={styles.header}>{cvData.Name}</Text>
            
            {/* Contact Info */}
            <View style={styles.contactInfo}>
              <Text>{cvData.Email} | {cvData.Phone} | {cvData.Location}</Text>
            </View>

            {/* Skills */}
            <View style={styles.section}>
              <Text style={styles.subHeader}>Skills</Text>
              <View style={styles.skillsContainer}>
                {cvData.Skills?.map((skill, index) => (
                  <Text key={index} style={styles.skill}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>

            {/* Experience */}
            <View style={styles.section}>
              <Text style={styles.subHeader}>Experience</Text>
              {cvData.Experience?.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <Text style={styles.companyName}>{exp.title}</Text>
                  <Text style={styles.period}>{exp.period}</Text>
                  <Text style={styles.description}>{exp.description}</Text>
                </View>
              ))}
            </View>

            {/* Education */}
            <View style={styles.section}>
              <Text style={styles.subHeader}>Education</Text>
              {cvData.Education?.map((edu, index) => (
                <View key={index} style={styles.experienceItem}>
                  <Text style={styles.companyName}>{edu.degree}</Text>
                  <Text style={styles.period}>{edu.period}</Text>
                  <Text style={styles.description}>{edu.institution}</Text>
                </View>
              ))}
            </View>
          </Page>
        </Document>
      </PDFViewer>

      <div className="flex justify-end gap-4 mt-4">
        <Button onClick={() => window.print()}>
          Print CV
        </Button>
        <Button onClick={() => {}}>
          Download PDF
        </Button>
      </div>
    </div>
  );
} 