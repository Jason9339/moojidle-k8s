import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import {
    WaitForBackendReady,
    ResetBackendDatabase,
} from './setup.js'

import {
    GetSimpleExams,
    UpdateExamScore,
    GetCourseExams,
    UploadExam,
    DownloadExam
} from '@/services/ExamApi.js'

describe('ExamApi Test', () => {
    beforeAll(async () => {
        await WaitForBackendReady()
    });

    beforeEach(async () => {
        await ResetBackendDatabase()
    });

    // Get
    // testing GetSimpleExams
    describe("GetSimpleExams integration test", async () => {
        it("given a courseId, get exam's name, max score, percentage", async () => {
            const data = await GetSimpleExams(1);
    
            expect(data).toBeDefined();
            expect(data.length).toBeGreaterThanOrEqual(1);
            expect(data[0].exam_name).toBe("Exam 1 for Course 1");
            expect(data[0].max_score).toBe(100);
            expect(data[0].percentage).toBe(0.1);
        });
    });

    describe('GetCourseExams 整合測試', () => {
        it('應該成功獲取課程考試', async () => {
            const courseId = 1;
            const exams = await GetCourseExams(courseId);

            expect(Array.isArray(exams)).toBe(true);
            expect(exams.length).toBeGreaterThan(0);
            expect(exams[0]).toHaveProperty('id');
            expect(exams[0]).toHaveProperty('name');
        });

        it('應該返回錯誤當課程不存在', async () => {
            const courseId = 9999;
            let error;
            try {
                await GetCourseExams(courseId);
            } catch (err) {
                error = err;
            }
            expect(error).toBeDefined();
        });
    });

    describe('DownloadExam 整合測試', () => {
        it('應該在成功時觸發下載行為', async () => {
            // Mock browser APIs
            const createObjectURL = vi.fn(() => 'blob:url');
            const click = vi.fn();
            const removeChild = vi.fn();
            const appendChild = vi.fn();
            const setAttribute = vi.fn();
            const mockLink = {
                click,
                setAttribute,
                parentNode: { removeChild },
            };
    
            // Only mock createObjectURL, not the whole URL global
            if (!globalThis.URL) {
                globalThis.URL = class {};
            }
            const originalCreateObjectURL = globalThis.URL.createObjectURL;
            globalThis.URL.createObjectURL = createObjectURL;
    
            vi.stubGlobal('document', {
                createElement: vi.fn(() => mockLink),
                body: { appendChild },
                cookie: '',
            });
    
            // Mock api.get to return a fake blob and headers
            const fakeBlob = new Blob(['test']);
            const fakeHeaders = { 'content-disposition': 'attachment; filename=test.pdf' };
            const api = (await import('@/ApiClient.js')).default;
            vi.spyOn(api, 'get').mockResolvedValue({
                data: fakeBlob,
                headers: fakeHeaders,
            });
    
            await DownloadExam('/some/path/test.pdf', 'test.pdf');
    
            expect(createObjectURL).toHaveBeenCalled();
            expect(appendChild).toHaveBeenCalledWith(mockLink);
            expect(setAttribute).toHaveBeenCalledWith('download', 'test.pdf');
            expect(click).toHaveBeenCalled();
            expect(removeChild).toHaveBeenCalledWith(mockLink);
    
            // Restore
            globalThis.URL.createObjectURL = originalCreateObjectURL;
        });
    
        it('應該在失敗時呼叫 console.error', async () => {
            // Mock api.get to throw
            const api = (await import('@/ApiClient.js')).default;
            vi.spyOn(api, 'get').mockRejectedValue(new Error('File not found'));
    
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
            await DownloadExam('/not/exist/file.pdf', 'file.pdf');
    
            expect(errorSpy).toHaveBeenCalled();
    
            errorSpy.mockRestore();
        });
    });
    
    // Post
    describe('UploadExam 整合測試', () => {
        it('應該成功上傳考試（無附件）', async () => {
            const formData = new FormData();
            formData.append('courseId', 1);
            formData.append('createByUserId', 1);
            formData.append('examName', "Integration Test Exam");
            formData.append('startDate', "2025-03-01T00:00:00.000Z");
            formData.append('endDate', "2025-03-01T03:00:00.000Z");
            formData.append('description', "Integration test exam description");
            formData.append('maxScore', 100);
            formData.append('percentage', 0.2);

            const result = await UploadExam(formData);

            expect(result).toHaveProperty('message');
            expect(result).toHaveProperty('filesCount', 0);
        });

        it('應該處理缺少必要欄位', async () => {
            const formData = new FormData();
            // 不填寫必要欄位
            let error;
            try {
                await UploadExam(formData);
            } catch (err) {
                error = err;
            }
            expect(error).toBeDefined();
        });
    });

    // Put
    // testing UpdateExamScore
    describe("UpdateExamScore integration test", async () => {
        it("given a assId and payload, see if successful", async () => {
            const payload = {
                max_score: 120,
                percentage: 0.5
            };
            const result = await UpdateExamScore(1, payload);
    
            expect(result).toBeDefined();
            expect(result).toBe("Update successful!");
        });
    });

    // Delete
});