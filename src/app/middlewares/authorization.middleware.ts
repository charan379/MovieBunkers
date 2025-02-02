import HttpCodes from "@constants/http.codes.enum";
import UserRoles from "@constants/user.roles.enum";
import UserStatus from "@constants/user.status.enum";
import { UserDTO } from "@dto/user.dto";
import AuthorizationException from "@exceptions/authorization.exception";
import { UserService } from "@service/user.service";
import { verifyJwtToken } from "@utils/jwt";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Container from "typedi";

/**
 * Returns an Express middleware function that authorizes access based on the
 * provided allowed user roles.
 *
 * @param allowedRoles An array of allowed user roles.
 * @returns An Express middleware function that authorizes access.
 */

export default function Authorize(allowedRoles: UserRoles[]) {
  const userService = Container.get(UserService);

  return [
    /**
     * An async Express middleware function that authorizes access based on
     * the provided allowed user roles.
     *
     * @param req The Express request object.
     * @param res The Express response object.
     * @param next The Express next function.
     * @returns Void.
     */
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        //Authorization: 'Bearer TOKEN' or In signedCookies auth: 'Bearer TOKEN'
        const auth: string =
          req?.headers?.authorization || req?.signedCookies?.auth;
        if (!auth)
          throw new AuthorizationException(
            "Unauthorized Please Login!",
            HttpCodes.UNAUTHORIZED,
            "Token Not Provided at headers or cookies",
            `@Authorize.function(): Request Headers: ${JSON.stringify(
              req.headers
            )}, Request Signed Cookies: ${JSON.stringify(req.signedCookies)}`
          );

        const authToken: string = auth.split(" ")[1];
        if (!authToken)
          throw new AuthorizationException(
            "Unauthorized Please Login!",
            HttpCodes.UNAUTHORIZED,
            "headers or cookies auth persists but not in format of: 'Bearer TOKEN' ",
            `@Authorize.function():  Token: ${authToken}`
          );

        /**
         * verifyJwtToken and store deCodedToken details
         */
        const deCodedToken: JwtPayload | string = await verifyJwtToken(
          authToken
        );

        let jwtUserName: string | (() => string) | undefined =
          deCodedToken?.sub ?? undefined;
        if (!jwtUserName)
          throw new AuthorizationException(
            "Unauthorized Please Login!",
            HttpCodes.UNAUTHORIZED,
            "token decoded but userName sub not found in token payload",
            `@Authorize.function(): Token: ${authToken}, Decodedtoken: ${JSON.stringify(
              deCodedToken
            )}`
          );

        const userDTO: UserDTO = await userService.getUserByUserName(
          jwtUserName as string
        );
        if (!userDTO)
          throw new AuthorizationException(
            "Unauthorized Please Login!",
            HttpCodes.UNAUTHORIZED,
            "token decoded but userName not found in DB",
            `@Authorize.function(): Token: ${authToken}, Decodedtoken: ${deCodedToken}`
          );
        if (userDTO.status !== UserStatus.ACTIVE)
          throw new AuthorizationException(
            "Inactive User, Access Blocked !",
            HttpCodes.UNAUTHORIZED,
            "token decoded but user is inactive in db",
            `@Authorize.function(): Token: ${authToken}, Decodedtoken: ${JSON.stringify(
              deCodedToken
            )}, UserDTO: ${JSON.stringify(userDTO)} `
          );

        if (allowedRoles.indexOf(userDTO.role) === -1)
          throw new AuthorizationException(
            "Insufficient User Role, Access Blocked !",
            HttpCodes.UNAUTHORIZED,
            "token decoded but user role is not allowed to access this resource",
            `@Authorize.function(): Token: ${authToken}, Decodedtoken: ${JSON.stringify(
              deCodedToken
            )}, UserDTO: ${JSON.stringify(
              userDTO
            )}, Required Roles : ${allowedRoles.toString()}`
          );

        req.userName = userDTO.userName;

        next();
      } catch (error) {
        //  If error occur pass it to next function , a global exception handler
        next(error);
      }
    },
  ];
}
