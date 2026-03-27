import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(Error)
export class AppleFilters implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    response.status(status).json({
      message: "Lỗi này đã được xử lý bởi AppleFilters",
      error: exception.message,
    });
  }
}