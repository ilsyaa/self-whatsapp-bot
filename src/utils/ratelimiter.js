const limiter = new Set();

const hashLimiter = (from) => {
    return !!limiter.has(from);
};

const hitLimiter = (from) => {
    limiter.add(from);
    setTimeout(() => {
        return limiter.delete(from);
    }, 1500);
};

