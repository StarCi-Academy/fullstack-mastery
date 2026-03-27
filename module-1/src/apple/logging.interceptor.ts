import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // lấy giờ hiện tại, trước khi request tới controller, thì các em gọi now = Date.now()
    const now = Date.now();
    // gọi next.handle() để chạy controller
    // pipe là một phương thức của Observable, dùng để chạy các operators
    return (
      next
        .handle()
        // phần này chính là phần phía sau response, được gọi khi mà response được trả về
        .pipe(
          // phần n
          // tap là một operator của Observable, dùng để thực hiện các hành động sau khi Observable được phát ra
          tap(() => {
            // tính thời gian mà request đã được xử lý
            // bằng cách khởi tạo thời gian trước xử lý => lấy thời điểm sau khi 
            // xử lý xong để tính thời gian chạy controller
            // => phục vụ cho việc debug và monitoring request sau này
            // đo xem request chạy lâu không? đo xem backend mình code có trục trặc gì đấy?
            // lấy thời gian sau khi controller chạy xong
            const after = Date.now();
            // tính thời gian chạy controller
            const time = after - now;
            console.log(`Time: ${time}ms`);
          }),
        )
    );
  }
}
