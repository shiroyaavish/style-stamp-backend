import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AdminAuthDto,
  CreateAuthDto,
  LoginAuthDto,
  SendotpDto,
  VerifyOtpDto,
} from './dto/create-auth.dto';
import { JwtAuthGuard } from './lib/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }
  @Post('send-otp')
  sendOTP(@Body() SendotpDto: SendotpDto) {
    return this.authService.sendOTP(SendotpDto);
  }
  @Post('verify')
  verify(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verify(verifyOtpDto);
  }

  @Post('admin/register')
  adminCreate(@Body() adminAuthDto: AdminAuthDto) {
    return this.authService.adminCreate(adminAuthDto);
  }

  // @Post("/login")
  // login(
  //   @Body() loginAuthDto:loginAuthDto
  // ) {
  //   return this.authService.login(loginAuthDto);
  // }

  @Post('admin/login')
  adminLogin(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.adminLogin(loginAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  findOne(@Request() req: Request) {
    return this.authService.findOne(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Request() req: Request) {
    return this.authService.logout(req);
  }
  // @UseGuards(RefreshTokenGuard)
  @Post('/refreshToken')
  refreshToken(@Req() request: Request, @Query('token') token: string) {
    return this.authService.refreshToken(request, token);
  }
}
