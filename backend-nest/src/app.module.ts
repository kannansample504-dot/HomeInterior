import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EstimateModule } from './estimate/estimate.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    DatabaseModule,

    CacheModule.register({
      isGlobal: true,
      store: 'memory',
      ttl: 300,
    }),

    AuthModule,
    UsersModule,
    EstimateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
