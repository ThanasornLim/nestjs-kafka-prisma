import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '@app/prisma';
import { PrismaModule } from 'nestjs-prisma';

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
        },
      },
    ]),
    PrismaModule.forRoot({
      prismaServiceOptions: {
        middlewares: [
          async (params, next) => {
            // Check incoming query type
            if (params.model == 'User') {
              if (
                ['findFirst', 'findMany', 'findUnique'].includes(params.action)
              ) {
                // Change action to an update
                params.args['where'] = { deleted: true };
              }
              // if (params.action == 'deleteMany') {
              //   // Delete many queries
              //   params.action = 'updateMany';
              //   if (params.args.data != undefined) {
              //     params.args.data['deleted'] = true;
              //   } else {
              //     params.args['data'] = { deleted: true };
              //   }
              // }
            }
            console.log(params.action);
            return next(params);
          },
        ],
      },
    }),
  ],

  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
