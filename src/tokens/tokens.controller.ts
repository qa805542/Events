import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { AccessToken } from './schemas/token.schema';

@Controller('access-tokens')
export class AccessTokensController {
  constructor(private readonly accessTokensService: TokensService) {}

  @Post()
  create(@Body() tokenData: AccessToken): Promise<AccessToken> {
    return this.accessTokensService.createToken(tokenData.userId, tokenData.role, tokenData.rateLimiter, tokenData.expiry);
  }

  @Get()
  findAll(@Query('skip') skip: number = 0, @Query('limit') limit: number = 10): Promise<AccessToken[]> {
    return this.accessTokensService.findAllTokens(skip, limit);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string): Promise<AccessToken> {
    return this.accessTokensService.findTokenByUserId(userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<AccessToken>): Promise<AccessToken> {
    return this.accessTokensService.updateToken(id, updateData);
  }

//   @Delete(':id')
//   remove(@Param('id') id: string): Promise<AccessToken> {
//     return this.accessTokensService.deleteToken(id);
//   }
}
