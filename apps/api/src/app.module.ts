import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ComponentsModule } from './components/components.module';

@Module({
  imports: [AuthModule, ComponentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


