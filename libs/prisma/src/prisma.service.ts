import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();

    this.$use(async (params, next) => {
      // Check incoming query type
      if (['User'].includes(params.model)) {
        if (params.action == 'delete') {
          // Delete queries
          // Change action to an update
          params.action = 'update';
          params.args['data'] = { deleted: true, deleted_at: new Date() };
        }
        if (params.action == 'deleteMany') {
          // Delete many queries
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args.data['deleted'] = true;
          } else {
            params.args['data'] = { deleted: true, deleted_at: new Date() };
          }
        }
        if (
          ['findFirst', 'findMany', 'findUnique', 'findRaw'].includes(
            params.action,
          )
        ) {
          // Change action to an update
          params.args['where'] = { ...params.args['where'], deleted: false };
        }
      }
      console.log('Middleware called');
      console.log(params.action);

      return await next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
