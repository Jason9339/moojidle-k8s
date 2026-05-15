import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import {
    SaveFile,
    DeleteFile,
    GetFileInfo
} from '#src/services/file_services/file_storage_service.js';

describe('File Storage Service', () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    it('should save a file to GridFS and return a gridfs reference', async () => {
        const buffer = Buffer.from('hello gridfs');

        const savedFile = await SaveFile(buffer, 'hello.txt', 'material', {
            contentType: 'text/plain',
            size: buffer.length,
            uploadedByUserId: 1,
            relatedType: 'course',
            relatedId: 1
        });

        expect(savedFile.relativeUrl).toMatch(/^gridfs:/);
        expect(savedFile.fileId).toBeTruthy();
        expect(savedFile.originalName).toBe('hello.txt');
        expect(savedFile.contentType).toBe('text/plain');
        expect(savedFile.size).toBe(buffer.length);

        const fileInfo = await GetFileInfo(savedFile.relativeUrl);
        expect(fileInfo).toBeTruthy();
        expect(fileInfo.filename).toBe('hello.txt');
        expect(fileInfo.contentType).toBe('text/plain');
        expect(fileInfo.metadata).toMatchObject({
            originalName: 'hello.txt',
            category: 'material',
            uploadedByUserId: 1,
            relatedType: 'course',
            relatedId: 1
        });
    });

    it('should delete a GridFS file', async () => {
        const savedFile = await SaveFile(Buffer.from('delete me'), 'delete.txt', 'assignment');

        const deleted = await DeleteFile(savedFile.relativeUrl);

        expect(deleted).toBe(true);
        expect(await GetFileInfo(savedFile.relativeUrl)).toBeNull();
    });

    it('should return false when deleting a missing GridFS file', async () => {
        const missingRef = `gridfs:${new mongoose.Types.ObjectId().toString()}`;

        const deleted = await DeleteFile(missingRef);

        expect(deleted).toBe(false);
    });
});
