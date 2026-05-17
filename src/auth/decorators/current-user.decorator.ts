import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface RequestWithUser {
  user: { id: string; email: string; role: string };
}

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;
    return data ? user[data as keyof typeof user] : user;
  },
);
