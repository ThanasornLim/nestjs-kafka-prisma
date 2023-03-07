import { Controller } from '@nestjs/common';
import { MyAppService } from './my-app.service';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class MyAppController {
  constructor(private readonly myAppService: MyAppService) {}

  @MessagePattern('medium.rocks')
  readMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const response =
      `Receiving a new message from topic: medium.rocks: ` +
      JSON.stringify(originalMessage.value);
    console.log(response);
    return response;
  }

  @MessagePattern('user.create')
  async createUser(@Payload() name: string) {
    const result = await this.myAppService.addUser(name);
    return result;
  }

  @MessagePattern('user.get')
  async getUser() {
    const result = await this.myAppService.getUsers();
    return result;
  }

  @MessagePattern('user.delete')
  async deleteUser(@Payload() id: number) {
    const result = await this.myAppService.removeUser(+id);
    return result;
  }
}
