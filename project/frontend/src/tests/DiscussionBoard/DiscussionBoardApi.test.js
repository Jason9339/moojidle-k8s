import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "@/ApiClient"; 
import {
    GetBoardsGroupByCourseByUserID,
    CreateDiscussionBoard,
    DeleteDiscussionBoard,
    EditDiscussionBoard
} from "@/services/DiscussionBoardApi";

describe("Discussion Board API Functions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(api, 'get');
        vi.spyOn(api, 'post');
        vi.spyOn(api, 'delete');
        vi.spyOn(api, 'patch');
    });
    
    describe("GetBoardsGroupByCourseByUserID", () => {
        it("should get boards grouped by course", async () => {
            const mockData = [{
                course_id: 1,
                boards: []
            }];
            api.get.mockResolvedValueOnce({ data: mockData });

            const userId = '1';
            const result = await GetBoardsGroupByCourseByUserID(userId);
            
            expect(api.get).toHaveBeenCalledWith(`/discussion-board/user-course-boards/${userId}`);
            expect(Array.isArray(result)).toBe(true);
        });

        it("should handle API error", async () => {
            api.get.mockRejectedValueOnce(new Error("API Error"));
            
            const userId = '1';
            const result = await GetBoardsGroupByCourseByUserID(userId);
            
            expect(result).toBeUndefined();
        });
    });

    describe("CreateDiscussionBoard", () => {
        it("should create a discussion board", async () => {
            const mockResponse = {
                data: {
                    board_id: 1,
                    name: 'Test Discussion Board'
                }
            };
            api.post.mockResolvedValueOnce(mockResponse);

            const courseId = '1';
            const boardName = 'Test Discussion Board';
            const result = await CreateDiscussionBoard(courseId, boardName);
            
            expect(api.post).toHaveBeenCalledWith("/discussion-board/course-boards", {
                course_id: courseId,
                name: boardName
            });
            expect(result).toHaveProperty('board_id');
            expect(result).toHaveProperty('board_name', boardName);
        });

        it("should handle creation error", async () => {
            api.post.mockRejectedValueOnce(new Error("Creation Failed"));
            
            const courseId = '1';
            const boardName = 'Test Discussion Board';
            
            await expect(CreateDiscussionBoard(courseId, boardName))
                .rejects.toThrow();
        });
    });

    describe("DeleteDiscussionBoard", () => {
        it("should delete a discussion board", async () => {
            const mockResponse = {
                data: { message: 'Discussion board deleted successfully' }
            };
            api.delete.mockResolvedValueOnce(mockResponse);

            const boardId = '1';
            const result = await DeleteDiscussionBoard(boardId);
            
            expect(api.delete).toHaveBeenCalledWith(`/discussion-board/course-boards/${boardId}`);
            expect(result).toHaveProperty('message', 'Discussion board deleted successfully');
        });

        it("should handle deletion error", async () => {
            api.delete.mockRejectedValueOnce(new Error("Deletion Failed"));
            
            const boardId = '1';
            await expect(DeleteDiscussionBoard(boardId)).rejects.toThrow();
        });
    });

    describe("EditDiscussionBoard", () => {
        it("should edit a discussion board name", async () => {
            const mockResponse = {
                data: { 
                    success: true,
                    message: 'Board updated successfully'
                }
            };
            api.patch.mockResolvedValueOnce(mockResponse);

            const boardId = '1';
            const newName = 'Updated Board Name';
            const result = await EditDiscussionBoard(boardId, newName);
            
            expect(api.patch).toHaveBeenCalledWith(
                `/discussion-board/course-boards/${boardId}`,
                { board_name: newName }
            );
            expect(result).toHaveProperty('success', true);
        });

        it("should handle edit error", async () => {
            api.patch.mockRejectedValueOnce(new Error("Update Failed"));
            
            const boardId = '1';
            const newName = 'Updated Board Name';
            await expect(EditDiscussionBoard(boardId, newName)).rejects.toThrow();
        });
    });
});