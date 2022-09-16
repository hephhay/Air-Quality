import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from "express";


import { CustomError } from "../errors";

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */
function handleError(
    err:  CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let defaultError = {
        // set default
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg:  'Something went wrong try again later',
        status: 'failed'
    };

    if (err instanceof CustomError){
        defaultError.msg = err.message;
    }

    res.status(defaultError.statusCode).send({
        'details': defaultError.msg,
        'status': defaultError.status
    });
};

export default handleError;