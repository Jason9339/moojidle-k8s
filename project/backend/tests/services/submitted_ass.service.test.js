import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import {
    FindProjectSubAssignByUserIdAssId,
} from '#src/services/submitted_ass_services.js';

describe("Testing submitted assigns' Services", () => {
    beforeAll(global.beforeAll);
    afterAll(global.afterAll);
    beforeEach(global.beforeEach);

    // Find series:
    // testing FindProjectSubAssignByUserIdAssId
    describe("Find all versions of HW (with no description and attachments) submitted by an user)", () => {
        it("given a valid ass_id and user_id", async () => {
            const subAssigns = await FindProjectSubAssignByUserIdAssId(3, 1);

            expect(subAssigns).toBeDefined();
            expect(subAssigns.length).toBe(1);
            expect(subAssigns[0].s_ass_id).toBe(1);
            expect(subAssigns[0].ass_id).toBe(1);
            expect(subAssigns[0].submit_by_user_id).toBe(3);
            expect(subAssigns[0].submit_user_course_tag).toBe("User3's CustomTag_1");
            expect(subAssigns[0].submit_date).toStrictEqual(new Date("2025-01-14T00:00:00.000Z"));
            expect(subAssigns[0].score).toBe(100);
            expect(subAssigns[0].graded_by_user_id).toBe(2);

            expect(subAssigns[0].description).toBeUndefined();
            expect(subAssigns[0].attachments).toBeUndefined();
        });

        it("given an invalid ass_id", async () => {
            const subAssigns = await FindProjectSubAssignByUserIdAssId(3, 100);

            expect(subAssigns.length).toBe(0);
        });

        it("given an invalid user_id", async () => {
            const subAssigns = await FindProjectSubAssignByUserIdAssId(300, 1);

            expect(subAssigns.length).toBe(0);
        });
    });

    // Insert series:

    // Update series:

    // Delete series:
});