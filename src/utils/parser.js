import reactDocgen from 'react-docgen';
import fs from 'fs';

/**
 * Parse a React component file to extract prop types and default values.
 * @param {string} filePath - Path to the component file.
 * @returns {Object} Parsed metadata about the component.
 */
export function parseComponent(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsedData = reactDocgen.parse(fileContent, reactDocgen.resolver.findExportedComponentDefinition);

    return parsedData;
}