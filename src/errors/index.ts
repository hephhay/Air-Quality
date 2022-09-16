import { StatusCodes } from 'http-status-codes';

class CustomError extends Error{
    message!: string;
    statusCode!: number;

    constructor(message: string) {
        super(message);
    }
}


class NotFoundError extends CustomError {
    constructor(message:string) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

class BadRequestError extends CustomError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export { CustomError, NotFoundError, BadRequestError };