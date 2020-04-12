import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';

import { AuthToken, IAuthToken } from "../../models/AuthToken";
import { User } from "../../models/User";
import { secret, sessionTime } from '../../config';
import { ExpressRequest } from '../../enhancements/ExpressRequest';
import { createError } from '../../lib/errors';
import { createResponse } from '../../lib/response';


export const loginUser = async (req: ExpressRequest, res: Response): Promise<Response<any>> => {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (user && await compare(password, user.password)) {

        const token = jwt.sign({ id: user._id }, secret, { expiresIn: sessionTime });
        const tokenInfo = { user: user._id, token, isValid: true };
        const authToken = new AuthToken(tokenInfo);
        const exposedUser = { userName: user.userName, _id: user._id, email: user.email, name: user.fullName };

        try {
            await authToken.save();
            res.setHeader('Set-Cookie', `access_token=${token}; HttpOnly`);
            return createResponse(res, { status: 202, message: 'Successfully logged in.', data: { user: exposedUser } });
        } catch (e) {
            return createError(res, { code: 500, args: [e.message] });
        }

    } else {
        return createError(res, { code: 1004 });
    }

}
