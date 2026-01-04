import { Controller, Post, Body, UnauthorizedException, BadRequestException, Get, Delete, Param, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() body: { email: string; orgName: string; password?: string }) {
        try {
            return await this.authService.signup(body.email, body.orgName, body.password);
        } catch (e: any) {
            throw new BadRequestException(e.message);
        }
    }

    @Post('login')
    async login(@Body() body: { email: string; password?: string }) {
        try {
            return await this.authService.login(body.email, body.password);
        } catch (e: any) {
            // Pass through NotFound/Unauthorized exceptions
            if (e.status) throw e;
            throw new BadRequestException(e.message);
        }
    }

    @Post('token')
    async createToken(@Body() body: { userId: string; name: string }) {
        return this.authService.createToken(body.userId, body.name);
    }

    @Post('github')
    async githubLogin(@Body() body: { code: string }) {
        try {
            return await this.authService.githubLogin(body.code);
        } catch (e: any) {
            throw new BadRequestException(e.message);
        }
    }

    @Get('users')
    async listUsers(@Headers('authorization') token: string) {
        const user = await this.authService.validateToken(token);
        if (!user || user.email !== 'admin@gmail.com') throw new UnauthorizedException('Admin access required');
        return this.authService.listAllUsers();
    }

    @Delete('users/:id')
    async deleteUser(@Param('id') id: string, @Headers('authorization') token: string) {
        const user = await this.authService.validateToken(token);
        if (!user || user.email !== 'admin@gmail.com') throw new UnauthorizedException('Admin access required');
        return this.authService.deleteUser(id);
    }

    @Post('change-password')
    async changePassword(@Body() body: { userId: string, oldPass: string, newPass: string }) {
        return this.authService.changePassword(body.userId, body.oldPass, body.newPass);
    }

    @Get('tokens/:userId')
    async listTokens(@Param('userId') userId: string) {
        return this.authService.listTokens(userId);
    }

    @Delete('tokens/:id')
    async deleteToken(@Param('id') id: string, @Headers('authorization') token: string) {
        // Validate calling user
        const user = await this.authService.validateToken(token);
        if (!user) throw new UnauthorizedException('Invalid session');

        return this.authService.deleteToken(id, user.id);
    }

    @Get('me')
    async me(@Headers('authorization') token: string) {
        const user = await this.authService.validateToken(token);
        if (!user) throw new UnauthorizedException('Invalid token');
        return user;
    }
}
