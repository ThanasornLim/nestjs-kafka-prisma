import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { Response } from 'express';
import { PrismaService } from '@app/prisma';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    @Inject('HERO_SERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    ['medium.rocks', 'user.create', 'user.delete', 'user.get'].forEach((key) =>
      this.client.subscribeToResponseOf(`${key}`),
    );
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('kafka-test')
  testKafka() {
    return this.client.emit('medium.rocks', {
      foo: 'bar',
      data: new Date().toString(),
    });
  }

  @Get('kafka-test-with-response')
  testKafkaWithResponse() {
    return this.client.send('medium.rocks', {
      foo: 'bar',
      data: new Date().toString(),
    });
  }

  @Get('create-user/:username')
  createUserApi(@Param('username') username: string) {
    return this.client.send('user.create', username);
  }

  @Get('users')
  async getUsers(@Res() res: Response) {
    // return this.client.send('user.get', '');

    const users = await this.prisma.user.findMany({});

    return res.json(users);
  }

  // @Get('users')
  // async getUsers(@Res() res: Response) {
  //   const users = await this.prisma.user.findMany({});

  //   return res.json(users);
  // }

  @Get('test')
  async test(@Res() res: Response) {
    return res.send('THIS IS A TEST MESSAGE.');
  }

  @Delete('delete/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    // @Res() res: Response,
  ) {
    return this.client.send('user.delete', id);
  }
}
