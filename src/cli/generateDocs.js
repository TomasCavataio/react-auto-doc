import { parseComponent } from '../utils/parser.js';
import fs from 'fs';
import path from 'path';

/**
 * Generate documentation for all React components in a directory.
 * @param {string} dir - Directory containing React components.
 * @param {string} output - Output file for the generated documentation.
 */
export function generateDocs(dir, output) {
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.js') || file.endsWith('.jsx'));
    const docs = files.map(file => {
        const filePath = path.join(dir, file);
        try {
            const docData = parseComponent(filePath);
            return {
                file: file,
                ...docData,
            };
        } catch (error) {
            console.error(`Failed to parse ${file}:`, error.message);
            return null;
        }
    }).filter(Boolean);

    fs.writeFileSync(output, JSON.stringify(docs, null, 2));
    console.log(`Documentation generated at ${output}`);
}
