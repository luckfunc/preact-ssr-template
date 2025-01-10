class RenderError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RenderError';
        this.code = 'RENDER_ERROR';
    }
}

class APIError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'APIError';
        this.code = 'API_ERROR';
        this.status = status;
    }
}

module.exports = {
    RenderError,
    APIError
}; 