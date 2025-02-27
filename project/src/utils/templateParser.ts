export const extractPlaceholders = (template: string): string[] => {
  const regex = /\{([^}]+)\}/g;
  const matches = template.match(regex) || [];
  return matches.map(match => match.slice(1, -1));
};

export const mapPlaceholdersToColumns = (
  placeholders: string[],
  columns: string[]
): { [key: string]: string | null } => {
  const mapping: { [key: string]: string | null } = {};
  
  placeholders.forEach(placeholder => {
    // Try to find a case-insensitive match
    const matchingColumn = columns.find(
      column => column.toLowerCase() === placeholder.toLowerCase()
    );
    mapping[placeholder] = matchingColumn || null;
  });
  
  return mapping;
};

export const fillTemplate = (
  template: string,
  recipient: { [key: string]: any },
  mapping: { [key: string]: string | null }
): string => {
  let filledTemplate = template;
  
  Object.entries(mapping).forEach(([placeholder, column]) => {
    if (column && recipient[column] !== undefined) {
      const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
      filledTemplate = filledTemplate.replace(regex, String(recipient[column]));
    }
  });
  
  return filledTemplate;
};