import {
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { addRequestDataToEvent } from '@sentry/node';

@Catch()
export class CommonExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // const response = host.switchToHttp().getResponse();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    Sentry.withScope((scope) => {
      scope.addEventProcessor((event) => {
        return addRequestDataToEvent(event, request);
      });
      Sentry.captureException(exception);
    });

    if (exception instanceof HttpException) {
      // Handle HttpException errors
      console.log(exception);
      const message = exception.message;
      response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message,
      });
    } else if (exception instanceof BadRequestException) {
      // Handle HTTP 400 errors
      console.log(exception);
      const message = exception.message;
      response.status(400).json({
        statusCode: 400,
        message,
      });
    } else {
      // Handle all other errors as HTTP 500 errors
      console.log(exception);
      const message = exception.message || 'Internal server error';
      response.status(500).json({
        statusCode: 500,
        message,
      });
    }
  }
}
