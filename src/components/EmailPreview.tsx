import React from 'react';
import { Recipient, FontSettings } from '../types';

interface EmailPreviewProps {
  content: string;
  recipients: Recipient[];
  selectedRecipientIndex: number | null;
  onRecipientChange: (index: number | null) => void;
  fontSettings: FontSettings;
  onFontSettingsChange: (settings: Partial<FontSettings>) => void;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({
  content,
  recipients,
  selectedRecipientIndex,
  onRecipientChange,
  fontSettings,
  onFontSettingsChange,
}) => {
  const fontFamilies = [
    'Arial',
    'Calibri',
    'Times New Roman',
    'Verdana',
    'Helvetica',
    'Tahoma',
    'Georgia',
  ];

  const fontSizes = ['10px', '12px', '14px', '16px', '18px', '20px', '24px'];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Email Preview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
            Select Recipient
          </label>
          <select
            id="recipient"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={selectedRecipientIndex !== null ? selectedRecipientIndex : ''}
            onChange={(e) => onRecipientChange(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Select a recipient</option>
            {recipients.map((recipient, index) => {
              // Try to find email or name fields for display
              const displayValue = 
                recipient.email || 
                (recipient.first_name && recipient.last_name 
                  ? `${recipient.first_name} ${recipient.last_name}`
                  : `Recipient ${index + 1}`);
              
              return (
                <option key={index} value={index}>
                  {displayValue}
                </option>
              );
            })}
          </select>
        </div>
        
        <div>
          <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-1">
            Font Family
          </label>
          <select
            id="fontFamily"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={fontSettings.family}
            onChange={(e) => onFontSettingsChange({ family: e.target.value })}
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <select
            id="fontSize"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={fontSettings.size}
            onChange={(e) => onFontSettingsChange({ size: e.target.value })}
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="border rounded-lg p-6 bg-white">
        <div 
          className="prose max-w-none"
          style={{ 
            fontFamily: fontSettings.family, 
            fontSize: fontSettings.size 
          }}
          dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
        />
      </div>
    </div>
  );
};

export default EmailPreview;