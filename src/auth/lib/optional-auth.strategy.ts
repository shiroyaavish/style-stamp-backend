import {
    Injectable,
    ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        console.log(user);
        
        if (err || info || !user) {
            return null; // No user attached, allow access
        }
        return user;
    }
}
