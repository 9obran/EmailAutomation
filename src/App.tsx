import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Mail } from 'lucide-react';
import FileUploader from './components/FileUploader';
import PlaceholderMapper from './components/PlaceholderMapper';
import EmailPreview from './components/EmailPreview';
import EmailSender from './components/EmailSender';
import { extractPlaceholders, mapPlaceholdersToColumns, fillTemplate } from './utils/templateParser';
import { Recipient, PlaceholderMapping, FontSettings } from './types';

function App() {
  // Data state
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [templateContent, setTemplateContent] = useState<string>('');
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<PlaceholderMapping[]>([]);
  
  // UI state
  const [selectedRecipientIndex, setSelectedRecipientIndex] = useState<number | null>(null);
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    family: 'Arial',
    size: '14px',
  });
  
  // Process Excel file
  const handleExcelUpload = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<Recipient>(worksheet);
        
        if (jsonData.length === 0) {
          alert('The Excel file appears to be empty.');
          return;
        }
        
        // Extract column names
        const columnNames = Object.keys(jsonData[0]);
        
        setRecipients(jsonData);
        setColumns(columnNames);
        
        // Update mappings if template is already loaded
        if (placeholders.length > 0) {
          const newMappings = mapPlaceholdersToColumns(placeholders, columnNames);
          setMappings(
            placeholders.map(placeholder => ({
              placeholder,
              column: newMappings[placeholder],
            }))
          );
        }
        
        // Select the first recipient by default
        if (jsonData.length > 0) {
          setSelectedRecipientIndex(0);
        }
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('Failed to process the Excel file. Please make sure it\'s a valid Excel file.');
      }
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  // Process template file
  const handleTemplateUpload = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setTemplateContent(content);
        
        // Extract placeholders
        const extractedPlaceholders = extractPlaceholders(content);
        setPlaceholders(extractedPlaceholders);
        
        // Create initial mappings
        if (columns.length > 0) {
          const newMappings = mapPlaceholdersToColumns(extractedPlaceholders, columns);
          setMappings(
            extractedPlaceholders.map(placeholder => ({
              placeholder,
              column: newMappings[placeholder],
            }))
          );
        } else {
          setMappings(
            extractedPlaceholders.map(placeholder => ({
              placeholder,
              column: null,
            }))
          );
        }
      } catch (error) {
        console.error('Error processing template file:', error);
        alert('Failed to process the template file. Please make sure it\'s a valid text file.');
      }
    };
    
    reader.readAsText(file);
  };
  
  // Update mapping
  const handleMappingChange = (index: number, column: string | null) => {
    const newMappings = [...mappings];
    newMappings[index].column = column;
    setMappings(newMappings);
  };
  
  // Update font settings
  const handleFontSettingsChange = (settings: Partial<FontSettings>) => {
    setFontSettings(prev => ({ ...prev, ...settings }));
  };
  
  // Generate preview content
  const getPreviewContent = (): string => {
    if (!templateContent || selectedRecipientIndex === null) {
      return 'Select a recipient to preview the email.';
    }
    
    const recipient = recipients[selectedRecipientIndex];
    const mappingDict: { [key: string]: string | null } = {};
    
    mappings.forEach(mapping => {
      mappingDict[mapping.placeholder] = mapping.column;
    });
    
    return fillTemplate(templateContent, recipient, mappingDict);
  };
  
  // Check if we can send emails
  const canSendEmail = (): boolean => {
    return (
      recipients.length > 0 &&
      templateContent.length > 0 &&
      selectedRecipientIndex !== null &&
      mappings.every(mapping => mapping.column !== null)
    );
  };
  
  // Send email (simulated)
  const handleSendEmail = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // In a real implementation, this would connect to an email API
      // or backend service to send the email
      
      setTimeout(() => {
        // Simulate success (90% of the time) or failure (10% of the time)
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Failed to connect to email service'));
        }
      }, 1500);
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5">
                <h1 className="text-2xl font-bold text-gray-900">Email Automation App</h1>
                <p className="text-gray-500">Upload data, customize templates, and preview emails</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FileUploader
              id="excel-upload"
              label="Upload Excel File with Recipient Data"
              accept=".xlsx,.xls"
              onFileUpload={handleExcelUpload}
            />
            
            <FileUploader
              id="template-upload"
              label="Upload Email Template"
              accept=".txt,.html"
              onFileUpload={handleTemplateUpload}
            />
          </div>
          
          {/* Show placeholder mapper if both files are uploaded */}
          {placeholders.length > 0 && columns.length > 0 && (
            <PlaceholderMapper
              mappings={mappings}
              columns={columns}
              onMappingChange={handleMappingChange}
            />
          )}
          
          {/* Show email preview if template is uploaded */}
          {templateContent && recipients.length > 0 && (
            <EmailPreview
              content={getPreviewContent()}
              recipients={recipients}
              selectedRecipientIndex={selectedRecipientIndex}
              onRecipientChange={setSelectedRecipientIndex}
              fontSettings={fontSettings}
              onFontSettingsChange={handleFontSettingsChange}
            />
          )}
          
          {/* Email sender */}
          <EmailSender
            canSend={canSendEmail()}
            onSendEmail={handleSendEmail}
          />
        </div>
      </div>
    </div>
  );
}

export default App;