export default function (error, req, res, next) {
    const statusCode = error.statusCode || 500;
    const name = error.name || 'UnknownError';
    const message = error.message || 'Unknown Error';
    const data = error.data || null;

    console.error(error);

    res.status(statusCode).json({statusCode, name, message, data});
}