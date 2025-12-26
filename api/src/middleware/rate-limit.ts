import { Request, Response, NextFunction } from 'express';
import * as _ from 'lodash';

class RateLimitError extends Error {
  public status = 429;
  public message = 'rate_limit';
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

  if (!userIp) {
    return next(new RateLimitError());
  }

  _.remove(USER_LIMIT, (r) => Date.now() - r.timestamp.getTime() > 60 * 1000);

  const userLimitRecord = _.find(USER_LIMIT, { ip: userIp });

  if (!userLimitRecord) {
    USER_LIMIT.push({
      ip: userIp,
      count: 1,
      timestamp: new Date(),
    });

    return next();
  }

  userLimitRecord.count++;

  if (userLimitRecord.count > 10) {
    return next(new RateLimitError());
  }

  return next();
}
