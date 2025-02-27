export interface Recipient {
  [key: string]: string | number;
}

export interface PlaceholderMapping {
  placeholder: string;
  column: string | null;
}

export interface EmailTemplate {
  content: string;
  placeholders: string[];
}

export interface FontSettings {
  family: string;
  size: string;
}