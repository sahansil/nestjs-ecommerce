import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('from app service')
    return 'Hello World! from App Service';
  }
}

//business logic , data transport , database interaction , external api calls , core functionality