import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
    private readonly secretKey = process.env.JWT_SECRET_KEY;

    sign(payload: any): string {
        return jwt.sign(payload, this.secretKey);
    }
}
