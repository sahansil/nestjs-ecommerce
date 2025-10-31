// application structure , module organization , dependency injection , service registration , controller setup
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './Categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Sahansil@77',
      database: 'ecommerce',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule, ProductsModule, CategoriesModule ,OrdersModule, UploadModule
  ],
  controllers: [AppController ],
  providers: [AppService],
  
})
export class AppModule {}

