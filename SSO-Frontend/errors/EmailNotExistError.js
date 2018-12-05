function EmailNotExistError(message) {
    this.statusCode = 422;
    this.name = 'EmailNotExistError';
    this.message = message || 'EmailNotExistError';
}

EmailNotExistError.prototype = Error.prototype;


export default EmailNotExistError;
