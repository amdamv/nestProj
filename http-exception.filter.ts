import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { get } from "lodash";

@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  handleError = () => {
    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      messages: ["Internal server error"],
    };
  };

  handleHttpException = (exception: HttpException) => {
    let message: string | string[] = get(
      exception.getResponse(),
      "message",
      exception.message,
    );

    if (Array.isArray(message)) {
      message = message.map((responseMessage) => {
        return (
          responseMessage.charAt(0).toUpperCase() + responseMessage.slice(1)
        );
      });
    }

    const messages: string[] = Array.isArray(message) ? message : [message];

    return {
      code: exception.getStatus(),
      messages,
    };
  };

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const exceptionData =
      exception instanceof HttpException
        ? this.handleHttpException(exception)
        : this.handleError();

    // handle for telegram
    if (context.getRequest().telegram) {
      return exceptionData.messages;
    }

    this.logger.error(exception.message);
    this.logger.error(
      `status=${exceptionData.code}, method=${request.method}, url=${request.url}, error={${exception.stack}}`,
    );

    response.status(exceptionData.code).json({
      status: exceptionData.code,
      data: {},
      error: exceptionData.messages,
    });
  }
}
