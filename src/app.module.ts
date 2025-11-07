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
import { Product } from './products/entities/product.entity';
import { CartItem } from './cart/entities/cart.entity';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env`,
    isGlobal: true,
    load: [config],
  }), 
  TypeOrmModule.forRoot({
    //use variables from config
    // @ts-expect-error dbType from env is string but TypeOrm expects a specific type
    type: config().database.dbType,
    host: config().database.host,
    port: config().database.port,
    username: config().database.username,
    password: config().database.password,
    database: config().database.database,
    autoLoadEntities: true,
    synchronize: true,
    entities: [Product, CartItem],
  }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }

