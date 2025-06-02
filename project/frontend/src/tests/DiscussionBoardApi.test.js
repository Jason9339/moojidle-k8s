import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditDiscussionBoard } from '@/services/DiscussionBoardApi.js'; // Adjust the import path as necessary
import api from "@/ApiClient.js";

describe('EditDiscussionBoard', () => {

    it('should edit discussion board successfully', async () => {
        const boardID = '1';

        
        const result = await EditDiscussionBoard(boardID);
        console.log(result);
        expect(result).toBeDefined();
        expect(result.board_id).toBe(1);
        expect(result.board_name).toBe("Edited Board Name");
    });
});
