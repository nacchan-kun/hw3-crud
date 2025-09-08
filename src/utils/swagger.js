import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to resolve $ref paths
const resolveRef = (refPath, baseDir) => {
  const fullPath = path.resolve(baseDir, refPath);
  const content = fs.readFileSync(fullPath, 'utf8');
  return yaml.load(content);
};

// Helper function to resolve all $ref in an object
const resolveRefs = (obj, baseDir) => {
  if (Array.isArray(obj)) {
    return obj.map(item => resolveRefs(item, baseDir));
  }
  
  if (obj && typeof obj === 'object') {
    if (obj['$ref']) {
      const refPath = obj['$ref'];
      return resolveRef(refPath, baseDir);
    }
    
    const resolved = {};
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = resolveRefs(value, baseDir);
    }
    return resolved;
  }
  
  return obj;
};

export const loadSwaggerSpec = () => {
  try {
    const docsDir = path.join(__dirname, '../../docs');
    const swaggerPath = path.join(docsDir, 'openapi.yaml');
    const swaggerFile = fs.readFileSync(swaggerPath, 'utf8');
    const swaggerSpec = yaml.load(swaggerFile);
    
    // Resolve all $ref references
    const resolvedSpec = resolveRefs(swaggerSpec, docsDir);
    
    return resolvedSpec;
  } catch (error) {
    console.error('Error loading swagger specification:', error);
    return null;
  }
};
