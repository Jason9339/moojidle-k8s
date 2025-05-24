import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetUserTagsById } from '@/services/UserApi.js'; // Adjust the import path as necessary
import api from "@/ApiClient.js";
import request from 'supertest';


// Mock the ApiClient
// vi.mock("@/ApiClient.js", () => ({
//   default: {
//     get: vi.fn()
//   }
// }));

describe('GetUserTagsById', () => {
  
  it('should fetch user tags successfully', async () => {
    const userId = '1';
    
    // Call the function
    const result = await GetUserTagsById(userId);
    
    console.log(result);
    // Assertions
    // expect(api.get).toHaveBeenCalledWith(`/user/get-user-tags-by-id/${userId}`);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].user_id).toBe(1);
    expect(result[0].user_tag).toBe("User1's CustomTag_1");
  });

    it('should get Nothing', async () => {
        const userId = '100';
        const result = await GetUserTagsById(userId);
        console.log(result);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    })

});

