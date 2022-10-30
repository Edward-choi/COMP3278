class ApiError extends Error {
  constructor(message, { url, code, status, errors }) {
    super(message);
    this.url = url;
    this.code = code;
    this.status = status;
    this.errors = errors;
  }
}
