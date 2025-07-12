import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleModule } from './sample/sample.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DigitalHealthModule } from './digital-health/digital-health.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    SampleModule,
    DigitalHealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
