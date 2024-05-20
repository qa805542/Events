// src/tokens/tokens.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccessToken } from './schemas/token.schema';
import { JwtService } from './utils/jwt.service';
import { PubSubService } from '../events/pub.service';

@Injectable()
export class TokensService {
    constructor(@InjectModel('AccessToken') private tokenModel: Model<AccessToken>) { }

    //   async create(tokenData: Partial<AccessToken>): Promise<AccessToken> {
    //     const token = new this.tokenModel(tokenData);
    //     return token.save();
    //   }

    //   async findAll(): Promise<AccessToken[]> {
    //     return this.tokenModel.find().exec();
    //   }

    //   async findOne(id: string): Promise<AccessToken> {
    //     return this.tokenModel.findById(id).exec();
    //   }

    //   async update(id: string, tokenData: Partial<AccessToken>): Promise<AccessToken> {
    //     return this.tokenModel.findByIdAndUpdate(id, tokenData, { new: true }).exec();
    //   }

    // //   async remove(id: string): Promise<AccessToken> {
    // //     return this.tokenModel.findByIdAndRemove(id).exec();
    // //   }

    async createToken(userId: string, role: string, rateLimiter: number, expiry: Date): Promise<AccessToken> {

        /**
         *  Invoked if Admin credentails are presented
         */

        const issuedAt = new Date();

        const AccessToken = new JwtService().sign({
            userId,
            role,
            issuedAt: issuedAt.toISOString()
        });



        return await this.tokenModel.findOneAndUpdate({ userId, isDeleted: false },
            {
                userId,
                token: AccessToken,
                role,
                rateLimiter,
                expiry,
                issuedAt
            },
            { new: true, upsert: true })
            .lean();
    }

    async findAllTokens(skip: number, limit: number): Promise<AccessToken[]> {
        return this.tokenModel.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
    }

    async findTokenByUserId(userId: string): Promise<AccessToken> {
        return this.tokenModel.findOne({ userId, isDeleted: false }).lean();
    }

    async updateToken(userId: string, updateData: Partial<AccessToken>): Promise<AccessToken> {
        return this.tokenModel.findOneAndUpdate({ userId, isDeleted: false }, updateData, { new: true }).lean();
    }

    //   async deleteToken(id: string): Promise<AccessToken> {
    //     return this.tokenModel.findByIdAndRemove(id).exec();
    //   }
}
