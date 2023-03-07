import { NestFactory } from '@nestjs/core';
import { MyAppModule } from './my-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MyAppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
