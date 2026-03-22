import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST', 'localhost'),
        port: parseInt(config.get('POSTGRES_PORT', '5432'), 10),
        username: config.get('POSTGRES_USER', 'homeinterior'),
        password: config.get('POSTGRES_PASSWORD', 'changeme'),
        database: config.get('POSTGRES_DB', 'homeinterior'),
        autoLoadEntities: true,
        synchronize: false, // Django owns all migrations
      }),
    }),
  ],
})
export class DatabaseModule {}
