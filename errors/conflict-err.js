class ColflictError extends Error {
  constructor(message = 'Данный email уже существует.') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ColflictError;
