import { parseComponent } from '../utils/parser.js';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

/**
 * Extract runtime metadata if present (e.g., from decorators or HOCs).
 * @param {string} filePath - Path to the component file.
 * @returns {Object|null} Runtime metadata if available.
 */
async function getRuntimeMetadata(filePath) {
    try {
        const componentModule = await pathToFileURL(filePath).href;
        const component = componentModule.default || componentModule;

        return component.__docgenInfo || null;
    } catch (error) {
        console.error(`Error loading runtime metadata from ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Generate documentation for all React components in a directory.
 * @param {string} dir - Directory containing React components.
 * @param {string} output - Output file for the generated documentation.
 */
export async function generateDocs(dir, output) {
    console.log(`Scanning directory: ${dir}`);
    if (!fs.existsSync(dir)) {
        console.error(`Error: Directory ${dir} does not exist.`);
        process.exit(1);
    }

    const files = fs.readdirSync(dir).filter(file => /* file.endsWith('.js') || */ file.endsWith('.jsx'));
    console.log(`Files to process: ${files}`);

    if (files.length === 0) {
        console.log('No React components found in the directory.');
        process.exit(1);
    }

    const docs = await Promise.all(
        files.map(async file => {
            const filePath = path.join(dir, file);
            let staticDoc = null;
            let runtimeDoc = null;

            try {
                staticDoc = parseComponent(filePath);
            } catch (error) {
                console.error(`Failed to parse ${file} statically:`, error.message);
            }

            try {
                runtimeDoc = await getRuntimeMetadata(filePath);
            } catch (error) {
                console.error(`Failed to extract runtime metadata for ${file}:`, error.message);
            }

            return {
                file: file,
                ...(staticDoc || {}),
                ...(runtimeDoc || {}),
            };
        })
    );

    const validDocs = docs.filter(Boolean);

    if (validDocs.length === 0) {
        console.log('No documentation could be generated.');
        process.exit(1);
    }

    fs.writeFileSync(output, JSON.stringify(validDocs, null, 2));
    console.log(`Documentation generated at ${output}`);
}

const args = process.argv.slice(2);
if (args.length !== 2) {
    console.error('Usage: generateDocs <input-directory> <output-file>');
    process.exit(1);
}
generateDocs(args[0], args[1]);
