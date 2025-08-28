//** Simple in-memory rate limiting for demo
const usage = new Map();

export const checkRateLimit = (clientIp) => {
    const today = new Date().toDateString();
    const key = `${clientIp}_${today}`;
    const count = usage.get(key) || 0;
    
    if (count >= 10) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: new Date(Date.now() + 24*60*60*1000)
        };
    }
    
    usage.set(key, count + 1);
    return {
        allowed: true,
        remaining: 9 - count,
        resetTime: new Date(Date.now() + 24*60*60*1000)
    };
};