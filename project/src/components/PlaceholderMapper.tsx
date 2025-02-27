import React from 'react';
import { PlaceholderMapping } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface PlaceholderMapperProps {
  mappings: PlaceholderMapping[];
  columns: string[];
  onMappingChange: (index: number, column: string | null) => void;
}

const PlaceholderMapper: React.FC<PlaceholderMapperProps> = ({
  mappings,
  columns,
  onMappingChange,
}) => {
  const mappedCount = mappings.filter(m => m.column !== null).length;
  const progress = mappings.length > 0 ? (mappedCount / mappings.length) * 100 : 0;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Placeholder Mapping</h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Mapping Progress</span>
          <span>{mappedCount} of {mappings.length} placeholders mapped</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Placeholder
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Excel Column
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mappings.map((mapping, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {`{${mapping.placeholder}}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={mapping.column || ''}
                    onChange={(e) => onMappingChange(index, e.target.value || null)}
                  >
                    <option value="">Select a column</option>
                    {columns.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {mapping.column ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlaceholderMapper;