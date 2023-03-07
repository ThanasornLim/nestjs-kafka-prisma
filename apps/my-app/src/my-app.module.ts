import { Module } from '@nestjs/common';
import { MyAppController } from './my-app.controller';
import { MyAppService } from './my-app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from 'libs/prisma/src/prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HERO_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'hero',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'hero-consumer',
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [MyAppController],
  providers: [MyAppService, PrismaService],
})
export class MyAppModule {}
