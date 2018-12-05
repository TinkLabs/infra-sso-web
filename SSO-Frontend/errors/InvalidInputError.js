function InvalidInputError(message) {
    this.statusCode = 422;
    this.name = 'InvalidInputError';
    this.message = message || 'InvalidInputError';
}

InvalidInputError.prototype = Error.prototype;


export default InvalidInputError;
