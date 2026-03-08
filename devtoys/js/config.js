/**
 * DevToys - Global Search & Application Configuration
 * Defines all categories and tools available in the application.
 */

const TOOLBOX_CONFIG = {
    categories: [
        {
            id: 'text-tools',
            name: 'Text Tools',
            icon: 'type',
            tools: [
                { id: 'json-formatter', name: 'JSON Formatter', description: 'Format, validate and nicely print JSON data.' },
                { id: 'text-diff', name: 'Text Diff Checker', description: 'Compare two text blocks and highlight differences.' },
                { id: 'word-counter', name: 'Word Counter', description: 'Count characters, words, lines and paragraphs.' },
                { id: 'case-converter', name: 'Text Case Converter', description: 'Convert text between UPPERCASE, lowercase, camelCase, etc.' },
                { id: 'whitespace-remover', name: 'Whitespace Remover', description: 'Remove extra spaces, tabs and line breaks.' }
            ]
        },
        {
            id: 'encode-decode',
            name: 'Encode / Decode',
            icon: 'binary',
            tools: [
                { id: 'base64-encode', name: 'Base64 Encode', description: 'Encode text or data to Base64 format.' },
                { id: 'base64-decode', name: 'Base64 Decode', description: 'Decode Base64 format back to text.' },
                { id: 'url-encode', name: 'URL Encode/Decode', description: 'Encode or decode URL characters safely.' },
                { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode and inspect JSON Web Tokens.' }
            ]
        },
        {
            id: 'data-conversion',
            name: 'Data Conversion',
            icon: 'arrow-right-left',
            tools: [
                { id: 'csv-to-json', name: 'CSV to JSON', description: 'Convert CSV formatted text into JSON.' },
                { id: 'json-to-csv', name: 'JSON to CSV', description: 'Convert JSON arrays into CSV format.' }
            ]
        },
        {
            id: 'color-css',
            name: 'Color & CSS Tools',
            icon: 'palette',
            tools: [
                { id: 'color-converter', name: 'Color Code Converter', description: 'Convert colors between HEX, RGB, HSL and more.' },
                { id: 'gradient-text', name: 'Gradient Text Generator', description: 'Generate beautiful CSS text gradients.' },
                { id: 'box-shadow', name: 'Box Shadow Generator', description: 'Visually create CSS box-shadow effects.' }
            ]
        },
        {
            id: 'generators',
            name: 'Generation Tools',
            icon: 'wand-2',
            tools: [
                { id: 'uuid-generator', name: 'UUID/GUID Generator', description: 'Generate secure random UUIDs v4.' },
                { id: 'password-generator', name: 'Password Generator', description: 'Generate strong and secure passwords.' },
                { id: 'qr-generator', name: 'QR Code Generator', description: 'Create QR codes from text or URLs.' }
            ]
        }
    ]
};

// Flatten tools list for global search and routing
const ALL_TOOLS = TOOLBOX_CONFIG.categories.flatMap(cat => 
    cat.tools.map(tool => ({...tool, categoryId: cat.id, categoryName: cat.name}))
);
