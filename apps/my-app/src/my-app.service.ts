import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';

@Injectable()
export class MyAppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(name: string): string {
    return 'my-app' + name;
  }

  async addUser(name: string) {
    return await this.prisma.user.create({
      data: {
        name: name,
      },
    });
  }

  async getUsers() {
    return await this.prisma.user.findMany({});
  }

  async removeUser(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
