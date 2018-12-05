function EmailExistError(message) {
    this.statusCode = 422;
    this.name = 'EmailExistError';
    this.message = message || 'EmailExistError';
}

EmailExistError.prototype = Error.prototype;


export default EmailExistError;
