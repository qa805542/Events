import { Console } from 'console';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface JWTClaim {
    "userId": string,
    "role": string,
    "issuedAt": string,
    "iat": number
}

export function ValidationMiddleware(req: Request, res: Response, next: NextFunction) {

    /**
     * 
     *  Rules:
     *  1. Only admin can create tokens
     *  2. Only admin can list all token
     *  3. Only admin can delete any token
     *  4. Only admin can edit any token's details
     *  4. User can only view its token details
     *  5. User can only delete/disable its token
     */


    const apiPath = req.path; // Access the API path
    console.log('API Path:', apiPath, req.url, req.baseUrl, req.originalUrl, req.method);
    //next();

    try {

        const token = req.headers.authorization?.split(' ')[1];

        if (token) {

            try {

                const tokenClaim: JWTClaim = jwt.verify(token, process.env.JWT_SECRET_KEY);

                const { userId, role, issuedAt } = tokenClaim;

                console.log('Decoded JWT Claims:', tokenClaim, userId, role, issuedAt);

                if (role.toUpperCase() === "USER") {

                    if (["POST", "PATCH"].includes(req.method)) 
                        return res.status(403).json({ message: "Unauthorized: User cannot perform this action" });

                    else if (["GET", "DELETE"].includes(req.method)) {
                        
                        const userIdParam = req.baseUrl.split("/")[2]

                        if (userId !== userIdParam)
                            return res.status(403).json({ message: "Unauthorized: User cannot perform this action" });
                    }

                }
            } catch (error) {
                console.error('Error decoding JWT token:', error.message);
            }
        }



    } catch (error) {

    }

    next();
}
