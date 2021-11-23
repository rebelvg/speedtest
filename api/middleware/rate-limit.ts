import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';

class RateLimitError extends Error {
  public status = 429;
}

const USER_LIMIT: {
  ip: string;
  count: number;
  timestamp: Date;
}[] = [];

export function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userIp = req.ip;

  const userLimitRecord = _.find(USER_LIMIT, { ip: userIp });

  console.log(userIp, USER_LIMIT);

  if (!userLimitRecord) {
    USER_LIMIT.push({
      ip: userIp,
      count: 1,
      timestamp: new Date(),
    });

    return next();
  }

  if (userLimitRecord.count >= 1) {
    if (Date.now() - userLimitRecord.timestamp.getTime() > 1 * 60 * 1000) {
      userLimitRecord.timestamp = new Date();
      userLimitRecord.count = 1;

      return next();
    } else {
      return next(new RateLimitError('Rate limit, 10 requests per 10 minutes'));
    }
  }

  userLimitRecord.count++;

  return next();
}
