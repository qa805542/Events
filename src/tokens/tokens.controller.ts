import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { AccessToken } from './schemas/token.schema';
import { PubSubService } from '../events/pub.service';

@Controller('access-tokens')
export class AccessTokensController {
  constructor(private readonly accessTokensService: TokensService,
    private readonly pubSubService: PubSubService
  ) { }

  @Post()
  async create(@Body() tokenData: AccessToken): Promise<AccessToken | { status: number, message: string }> {

    try {

      const data = await this.accessTokensService.createToken(tokenData.userId, tokenData.role, tokenData.rateLimiter, tokenData.expiry);

      this.pubSubService.publish("token_created", {
        userId: tokenData.userId,
        role: data.role,
        rateLimiter: tokenData.rateLimiter,
        expiry: tokenData.expiry,
        issuedAt: data.issuedAt
      })

      return data;

    } catch (error) {

      return {
        status: 500,
        message: error.message
      }
    }

  }

  @Get()
  async findAll(@Query('skip') skip: number = 0, @Query('limit') limit: number = 10): Promise<AccessToken[] | { status: number, message: string }> {
    //return this.accessTokensService.findAllTokens(skip, limit);

    try {

      const data = await this.accessTokensService.findAllTokens(skip, limit);

      this.pubSubService.publish("channel1", {msg: "Hello"})
      
      return data;
    
    } catch (error) {

      return {
        status: 500,
        message: error.message
      }
    }
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<AccessToken> {
    return this.accessTokensService.findTokenByUserId(userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<AccessToken>): Promise<AccessToken> {
    return this.accessTokensService.updateToken(id, updateData);
  }

  //   @Delete(':id')
  //   remove(@Param('id') id: string): Promise<AccessToken> {
  //     return this.accessTokensService.deleteToken(id);
  //   }
}
