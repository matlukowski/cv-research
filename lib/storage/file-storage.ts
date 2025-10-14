import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

/**
 * Save file to storage
 * @param buffer - File buffer
 * @param filename - Original filename
 * @param teamId - Team ID for organization
 * @returns File URL or path
 */
export async function saveFile(
  buffer: Buffer,
  filename: string,
  teamId: number
): Promise<string> {
  if (STORAGE_TYPE === 'local') {
    return saveFileLocally(buffer, filename, teamId);
  } else if (STORAGE_TYPE === 'supabase') {
    // TODO: Implement Supabase storage
    throw new Error('Supabase storage not yet implemented');
  } else {
    throw new Error(`Unknown storage type: ${STORAGE_TYPE}`);
  }
}

/**
 * Save file to local filesystem
 */
async function saveFileLocally(
  buffer: Buffer,
  filename: string,
  teamId: number
): Promise<string> {
  // Create directory structure: uploads/team_{teamId}/
  const teamDir = path.join(process.cwd(), UPLOAD_DIR, `team_${teamId}`);
  await fs.mkdir(teamDir, { recursive: true });

  // Generate unique filename to avoid conflicts
  const fileExt = path.extname(filename);
  const baseName = path.basename(filename, fileExt);
  const hash = crypto.randomBytes(8).toString('hex');
  const uniqueFilename = `${baseName}_${hash}${fileExt}`;

  // Save file
  const filePath = path.join(teamDir, uniqueFilename);
  await fs.writeFile(filePath, buffer);

  // Return relative path (will be used to construct URL)
  return `/${UPLOAD_DIR}/team_${teamId}/${uniqueFilename}`;
}

/**
 * Get file from storage
 * @param fileUrl - File URL or path
 * @returns File buffer
 */
export async function getFile(fileUrl: string): Promise<Buffer> {
  if (STORAGE_TYPE === 'local') {
    return getFileLocally(fileUrl);
  } else if (STORAGE_TYPE === 'supabase') {
    // TODO: Implement Supabase storage
    throw new Error('Supabase storage not yet implemented');
  } else {
    throw new Error(`Unknown storage type: ${STORAGE_TYPE}`);
  }
}

/**
 * Get file from local filesystem
 */
async function getFileLocally(fileUrl: string): Promise<Buffer> {
  // Remove leading slash if present
  const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
  const filePath = path.join(process.cwd(), relativePath);

  return await fs.readFile(filePath);
}

/**
 * Delete file from storage
 * @param fileUrl - File URL or path
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  if (STORAGE_TYPE === 'local') {
    return deleteFileLocally(fileUrl);
  } else if (STORAGE_TYPE === 'supabase') {
    // TODO: Implement Supabase storage
    throw new Error('Supabase storage not yet implemented');
  } else {
    throw new Error(`Unknown storage type: ${STORAGE_TYPE}`);
  }
}

/**
 * Delete file from local filesystem
 */
async function deleteFileLocally(fileUrl: string): Promise<void> {
  const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
  const filePath = path.join(process.cwd(), relativePath);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
}

/**
 * Check if file exists
 */
export async function fileExists(fileUrl: string): Promise<boolean> {
  if (STORAGE_TYPE === 'local') {
    const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
    const filePath = path.join(process.cwd(), relativePath);

    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  } else if (STORAGE_TYPE === 'supabase') {
    // TODO: Implement Supabase storage
    throw new Error('Supabase storage not yet implemented');
  }

  return false;
}

/**
 * Get file size in bytes
 */
export async function getFileSize(fileUrl: string): Promise<number> {
  if (STORAGE_TYPE === 'local') {
    const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
    const filePath = path.join(process.cwd(), relativePath);

    const stats = await fs.stat(filePath);
    return stats.size;
  } else if (STORAGE_TYPE === 'supabase') {
    // TODO: Implement Supabase storage
    throw new Error('Supabase storage not yet implemented');
  }

  throw new Error(`Unknown storage type: ${STORAGE_TYPE}`);
}
