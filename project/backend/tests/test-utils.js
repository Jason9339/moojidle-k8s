import { vi } from 'vitest';

// 創建 mock request
export const createMockReq = (body = {}, params = {}, query = {}, headers = {}) => ({
    body,
    params,
    query,
    headers
});

//創建 mock response
export const createMockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.cookie = vi.fn().mockReturnValue(res);
    res.clearCookie = vi.fn().mockReturnValue(res);
    res.redirect = vi.fn().mockReturnValue(res);
    return res;
};

//創建 mock next
export const createMockNext = () => vi.fn();

//重置所有 mock
export const resetMocks = (res) => {
    if (res && res.status) {
        res.status.mockClear();
        res.send.mockClear();
        res.json.mockClear();
        if (res.cookie) res.cookie.mockClear();
        if (res.clearCookie) res.clearCookie.mockClear();
        if (res.redirect) res.redirect.mockClear();
    }
}; 