import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('login')
  @UseGuards(AuthGuard('auth0'))
  login() {
    // This route will redirect to Auth0
  }

  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  callback(@Req() req) {
    console.log(req.user);
    // This route will handle the Auth0 callback after successful authentication
    // You can access the authenticated user's information from the req.user object
  }

  @Get('logout')
  logout() {
    // This route will handle the logout process
  }
}
