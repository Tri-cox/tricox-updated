import { Module } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentsController } from './components.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ComponentsController],
  providers: [ComponentsService, PrismaService],
})
export class ComponentsModule {}
