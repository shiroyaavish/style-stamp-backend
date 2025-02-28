import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminAuthDto, CreateAuthDto, loginAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './lib/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }
  @Post('/send-otp')
  sendOTP(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/admin/register')
  adminCreate(@Body() adminAuthDto: AdminAuthDto) {
    return this.authService.adminCreate(adminAuthDto);
  }

  // @Post("/login")
  // login(
  //   @Body() loginAuthDto:loginAuthDto
  // ) {
  //   return this.authService.login(loginAuthDto);
  // }

  @Post('/admin/login')
  adminLogin(@Body() loginAuthDto: loginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  findOne(@Request() req: Request) {
    return this.authService.findOne(req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
