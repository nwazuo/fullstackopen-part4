const logger = require('./logger');

const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method);
    logger.info('Path: ', request.path);
    logger.info('Body: ', request.body);
    logger.info('---');

    next();
}


const unknownEndPoint = (error, request, response, next) => {
    response.status(404).send({error: 'unknown endpoint'});
}

//const errorRequestHandler 

module.exports = {
    requestLogger,
    unknownEndPoint
}
