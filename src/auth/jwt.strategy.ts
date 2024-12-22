import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AdminService } from 'src/admin/admin.service'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'hisoumik',
      passReqToCallback: true, 
    });
  }

  async validate(req: Request, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req); 

    
    if (this.adminService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    
    return { userId: payload.id, email: payload.email };
  }
}
