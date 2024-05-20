// pubsub/pubsub.service.ts
import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PubSubService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async publish(channel: string, message: any) {
    console.log("Trying to publish something.....", channel, message)
    console.log("status:", await this.redisClient.publish(channel, JSON.stringify(message)));
  }
}
