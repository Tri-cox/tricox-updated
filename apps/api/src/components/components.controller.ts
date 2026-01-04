import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, Body, Headers, Delete, Put, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ComponentsService } from './components.service';
import { AuthService } from '../auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Controller('components')
export class ComponentsController {
    constructor(
        private readonly componentsService: ComponentsService,
        private readonly authService: AuthService
    ) { }

    @Get('dashboard/stats')
    async getStats(@Headers('authorization') token: string) {
        console.log('GET /components/dashboard/stats hit');
        const user = await this.authService.validateToken(token);
        if (!user || user.email !== 'admin@gmail.com') throw new UnauthorizedException('Admin access required');
        return this.componentsService.getStats();
    }

    @Post('ship')
    @UseInterceptors(FileInterceptor('file'))
    async ship(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
        @Headers('authorization') token: string
    ) {
        const user = await this.authService.validateToken(token);
        if (!user) {
            // If token invalid, throw error
            // e.g. throw new UnauthorizedException('Invalid token');
            // For now, let's be strict
            throw new UnauthorizedException('Invalid or missing token');
        }
        return this.componentsService.ship(user, file, body);
    }

    @Get('details/:id')
    async getDetails(@Param('id') id: string) {
        return this.componentsService.getComponentDetails(id);
    }

    @Get('dock/:org/:component')
    async dock(
        @Param('org') org: string,
        @Param('component') component: string
    ) {
        return this.componentsService.dock(org, component);
    }



    @Get()
    async getAll(@Headers('authorization') token: string) {
        const user = await this.authService.validateToken(token);
        if (!user || user.email !== 'admin@gmail.com') throw new UnauthorizedException('Admin access required');
        return this.componentsService.listAll();
    }

    @Get(':org')
    async list(
        @Param('org') org: string,
        @Query('public') isPublic?: string
    ) {
        return this.componentsService.list(org, isPublic === 'true');
    }

    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @Headers('authorization') token: string
    ) {
        const user = await this.authService.validateToken(token);
        if (!user) throw new UnauthorizedException('Invalid token');
        return this.componentsService.deleteComponent(id, user);
    }

    @Post(':id') // Using POST for update to avoid payload issues with PUT in some proxies, but semantically PUT is better. CLI uses POST ship.
    async update(
        @Param('id') id: string,
        @Body() body: { content: string },
        @Headers('authorization') token: string
    ) {
        const user = await this.authService.validateToken(token);
        if (!user) throw new UnauthorizedException('Invalid token');

        return this.componentsService.updateComponent(id, body.content, user);
    }
}
