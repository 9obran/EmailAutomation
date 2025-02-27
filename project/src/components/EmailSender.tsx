import React, { useState } from 'react';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';

interface EmailSenderProps {
  canSend: boolean;
  onSendEmail: () => Promise<void>;
}

const EmailSender: React.FC<EmailSenderProps> = ({ canSend, onSendEmail }) => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!canSend) return;
    
    setIsSending(true);
    setError(null);
    setSuccess(false);
    
    try {
      await onSendEmail();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Send Email</h3>
        
        <button
          type="button"
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
            ${canSend 
              ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
              : 'bg-gray-300 cursor-not-allowed'}`}
          disabled={!canSend || isSending}
          onClick={handleSend}
        >
          {isSending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              <Mail className="-ml-1 mr-2 h-4 w-4" />
              Send Email
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error sending email</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <p className="mt-1">
                  Note: This web app cannot directly send emails. In a real implementation, 
                  you would need to connect to an email service or API.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="rounded-md bg-green-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Email sent successfully</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Note: This is a simulation. In a real implementation, the email would be sent 
                  through an email service or API.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Browser Limitation:</strong> This web app cannot directly send emails via Outlook like the original Python app.
              In a real implementation, you would need to:
            </p>
            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
              <li>Connect to an email service API (SendGrid, Mailchimp, etc.)</li>
              <li>Set up a backend service to handle email sending</li>
              <li>Use a server-side solution for direct Outlook integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSender;