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
                { id: 'xml-formatter', name: 'XML Formatter', description: 'Format and prettify XML documents.' },
                { id: 'sql-formatter', name: 'SQL Formatter', description: 'Format SQL queries with proper indentation.' },
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
                { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode and inspect JSON Web Tokens.' },
                { id: 'html-escape', name: 'HTML Escape/Unescape', description: 'Convert characters to HTML entities and back.' }
            ]
        },
        {
            id: 'data-conversion',
            name: 'Data Conversion',
            icon: 'arrow-right-left',
            tools: [
                { id: 'csv-to-json', name: 'CSV to JSON', description: 'Convert CSV formatted text into JSON.' },
                { id: 'json-to-csv', name: 'JSON to CSV', description: 'Convert JSON arrays into CSV format.' },
                { id: 'ascii-hex-converter', name: 'ASCII ↔ HEX', description: 'Convert text between ASCII and HEX representation.' },
                { id: 'number-base', name: 'Number Base Converter', description: 'Convert numbers across Binary, Octal, Decimal and Hex.' }
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
            id: 'media-tools',
            name: 'Media Tools',
            icon: 'image',
            tools: [
                { id: 'image-base64', name: 'Image Base64 Converter', description: 'Convert images to Base64 data URIs and back.' }
            ]
        },
        {
            id: 'validation-network',
            name: 'Validation & Network',
            icon: 'check-circle',
            tools: [
                { id: 'credit-card-validator', name: 'Credit Card Validator', description: 'Validate credit card numbers using Luhn algorithm.' }
            ]
        },
        {
            id: 'calculators-time',
            name: 'Calculators & Time',
            icon: 'calculator',
            tools: [
                { id: 'aspect-ratio', name: 'Aspect Ratio Calculator', description: 'Calculate dimensions based on aspect ratios.' },
                { id: 'rem-px', name: 'REM / PX Converter', description: 'Convert between CSS REM and Pixel values.' },
                { id: 'epoch-converter', name: 'Epoch Converter', description: 'Convert Unix epoch timestamps to human readable dates.' }
            ]
        }
    ]
};

// Flatten tools list for global search and routing
const ALL_TOOLS = TOOLBOX_CONFIG.categories.flatMap(cat =>
    cat.tools.map(tool => ({ ...tool, categoryId: cat.id, categoryName: cat.name }))
);
