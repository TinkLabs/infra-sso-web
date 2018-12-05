function ResetTokenNotExistError(message) {
    this.statusCode = 422;
    this.name = 'ResetTokenNotExistError';
    this.message = message || 'ResetTokenNotExistError';
}

ResetTokenNotExistError.prototype = Error.prototype;


export default ResetTokenNotExistError;
