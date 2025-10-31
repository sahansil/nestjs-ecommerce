// route define , authentication , validation , request , response handling

import { Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }


@Post('/data')
  postData(): string {
    return "data posted";
}

@Put('/update')
updateData(): string {
  return "data updated";
}
}

