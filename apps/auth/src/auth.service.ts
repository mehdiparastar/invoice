import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) { }

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TokenPayload = { userId: user._id.toHexString() }
    const token = this.jwtService.sign(tokenPayload)

    const expires = new Date()
    expires.setSeconds(expires.getSeconds() + this.configService.getOrThrow<number>('JWT_EXPIRATION'))

    response.cookie('Authentication', token, { httpOnly: true, expires })
  }
}
