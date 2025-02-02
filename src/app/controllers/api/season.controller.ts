import HttpCodes from "@constants/http.codes.enum";
import { LevelOne, LevelThere, LevelTwo } from "@constants/user.roles.enum";
import SeasonDTO from "@dto/season.dto";
import { ObjectIdSchema } from "@joiSchemas/common.joi.schemas";
import { sortSkipLimitSchema } from "@joiSchemas/common.title.joi.schemas";
import { seasonSchema } from "@joiSchemas/season.joi.schema";
import Authorize from "@middlewares/authorization.middleware";
import { ISeason } from "@models/interfaces/season.interface";
import SeasonService from "@service/season.service";
import JoiValidator from "@utils/joi.validator";
import { NextFunction, Request, Response, Router } from "express";
import { Inject, Service } from "typedi";

/**
 * Controller for handling seasons related API requests
 * @class SeasonController
 */
@Service()
class SeasonController {
    public router: Router;
    private seasonService: SeasonService;

    /**
     * Constructor of SeasonController class
     * @param seasonService An instance of SeasonService class
     */
    constructor(@Inject() seasonService: SeasonService) {
        this.seasonService = seasonService;
        this.router = Router();

        /**
         * @swagger
         * /seasons/new:
         *  post:
         *   tags:
         *     - Seasons
         *   summary: API to create new season
         *   description: create a season for valid season object
         *   requestBody:
         *      content:
         *        application/json:
         *          schema:
         *              $ref: '#/components/schemas/season'
         *   responses:
         *       201:
         *          description: Success
         *       400:
         *          description: Invalid new season
         *       401:
         *          description: Unauthorized
         */
        this.router.post("/new", Authorize(LevelTwo), this.createSeason.bind(this));

        /**
          * @swagger
          * /seasons/{id}:
          *  get:
          *   tags:
          *     - Seasons
          *   summary: API to fetch season based on its id
          *   description: fetches seasons with its id
          *   parameters:
          *     - in: path
          *       name: id
          *       schema:
          *          type: string
          *   responses:
          *       200:
          *          description: Success
          *       400:
          *          description: Invalid id
          *       401:
          *          description: Unauthorized
          */
        this.router.get("/:id", Authorize(LevelOne), this.getSeasonById.bind(this));

        /**
          * @swagger
          * /seasons/tv/{id}:
          *  get:
          *   tags:
          *     - Seasons
          *   summary: API to fetch seasons based on tvShow id
          *   description: fetches seasons with tvShow id
          *   parameters:
          *     - in: path
          *       name: id
          *       schema:
          *          type: string
          *     - in: query
          *       name: limit
          *       schema:
          *          type: integer
          *     - in: query
          *       name: skip
          *       schema:
          *          type: integer
          *          example: 3
          *          default: 0
          *          minimum: 0
          *     - in: query
          *       name: sort_by
          *       schema:
          *          type: string
          *          example: air_date.desc
          *   responses:
          *       200:
          *          description: Success
          *       400:
          *          description: Invalid id
          *       401:
          *          description: Unauthorized
          */
        this.router.get("/tv/:id", Authorize(LevelOne), this.getSeasonsByTvShowId.bind(this));

        /**
          * @swagger
          * /seasons/update/{id}:
          *  put:
          *   tags:
          *     - Seasons
          *   summary: API to update seasons based on its id
          *   description: updates seasons
          *   requestBody:
          *      content:
          *        application/json:
          *          schema:
          *              $ref: '#/components/schemas/season'
          *   parameters:
          *     - in: path
          *       name: id
          *       schema:
          *          type: string
          *   responses:
          *       200:
          *          description: Success
          *       400:
          *          description: Invalid id / update
          *       401:
          *          description: Unauthorized
          */
        this.router.put("/update/:id", Authorize(LevelTwo), this.updateSeasonById.bind(this));

        /**
          * @swagger
          * /seasons/delete/{id}:
          *  delete:
          *   tags:
          *     - Seasons
          *   summary: API to delete seasons based on its id
          *   description: deleted season
          *   parameters:
          *     - in: path
          *       name: id
          *       schema:
          *          type: string
          *   responses:
          *       200:
          *          description: Success
          *       400:
          *          description: Invalid id
          *       401:
          *          description: Unauthorized
          */
        this.router.delete("/delete/:id", Authorize(LevelThere), this.deleteSeasonById.bind(this));

        /**
          * @swagger
          * /seasons/delete-many/{tvShowId}:
          *  delete:
          *   tags:
          *     - Seasons
          *   summary: API to delete seasons based on tv show id id
          *   description: deleted season
          *   parameters:
          *     - in: path
          *       name: tvShowId
          *       schema:
          *          type: string
          *   responses:
          *       200:
          *          description: Success
          *       400:
          *          description: Invalid id
          *       401:
          *          description: Unauthorized
          */
        this.router.delete("/delete-many/:id", Authorize(LevelThere), this.deleteSeasonsByTvShowId.bind(this));
    }

    /**
     * Controller to handle API requests for creating new season
     *
     * @route POST /seasons/new
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
     */
    private async createSeason(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate request body against season schema
            const validNewSeason: ISeason = await JoiValidator(seasonSchema, req.body, {
                abortEarly: false,
                stripUnknown: true,
            });

            // Call create method of seasonService class to create new season
            const createdSeason: SeasonDTO = await this.seasonService.create(
                validNewSeason
            );

            // Send response with code 201 and createSeason to client
            res.status(HttpCodes.CREATED).json(createdSeason);
        } catch (error) {
            // Pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
       * Controller to handle API requests for getting season by its id
       * 
       * @route GET /seasons/:id
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async getSeasonById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate seasonId
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {
                abortEarly: false,
                stripUnknown: true
            })

            // call getSeasonById method of seasonService class to get seasonDTO
            const seasonDTO: SeasonDTO = await this.seasonService.getSeasonById(validId);

            // respond with status code 200 with a SeasonDTO to client
            res.status(HttpCodes.OK).json(seasonDTO);
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
       * Controller to handle API requests for getting seasons by tvshow id
       * 
       * @route GET /seasons/tv/:id
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async getSeasonsByTvShowId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate seasonId
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {
                abortEarly: false,
                stripUnknown: true
            })

            //  validate skip, sort, limit options in query
            const validSkipSortLimitQuery = await JoiValidator(sortSkipLimitSchema, req?.query, {
                abortEarly: false,
                stripUnknown: true
            })

            // call getSeasonsByTvShowId method of seasonService class to get array of seasonDTOs
            const seasonDTOs: SeasonDTO[] = await this.seasonService.getSeasonsByTvShowId(validId, {
                limit: validSkipSortLimitQuery?.limit ?? 0,
                skip: validSkipSortLimitQuery?.skip ?? 0,
                sortBy: validSkipSortLimitQuery?.sort_by ?? "createdAt.desc",
            });

            // respond with status code 200 with an array of SeasonDTOs to client
            res.status(HttpCodes.OK).json(seasonDTOs);
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
       * Controller to handle API requests for updating seasons by its id
       * 
       * @route PUT /seasons/update/:id
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async updateSeasonById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate seasonId
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {
                abortEarly: false,
                stripUnknown: true
            });

            // validate update object 
            const update: ISeason = await JoiValidator(seasonSchema, req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            // call updateSeasonById method of seasonService class to update season and get updated season
            const seasonDTO: SeasonDTO = await this.seasonService.updateSeasonById(validId, update);

            // respond with status code 200 with seasonDTO to client
            res.status(HttpCodes.OK).json(seasonDTO);
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
       * Controller to handle API requests for deleting a seasons by its id
       * 
       * @route DELETE /seasons/delete/:id
       * 
       * @param {Request} req - Express request object
       * @param {Response} res - Express response object
       * @param {NextFunction} next - Express next middleware function
       * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
       */
    private async deleteSeasonById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate seasonId
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {
                abortEarly: false,
                stripUnknown: true
            });

            // call deleteSeasonById method of seasonService class to delete season
            await this.seasonService.deleteSeasonById(validId);

            // respond with status code 200 after deleting
            res.status(HttpCodes.OK).json({ message: 'Successfully Deleted' });
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }

    /**
   * Controller to handle API requests for deleting all seasons by tv show id id
   * 
   * @route DELETE /seasons/delete-many/:id
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next middleware function
   * @returns {Promise<void>} - Returns a promise that resolves with void when the function completes.
   */
    private async deleteSeasonsByTvShowId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate tvshow id
            const validId = await JoiValidator(ObjectIdSchema, req?.params?.id, {
                abortEarly: false,
                stripUnknown: true
            });

            // call deleteAllSeasonByTVShowId method of seasonService class to delete all seasons
            await this.seasonService.deleteAllSeasonByTVShowId(validId);

            // respond with status code 200 after deleting
            res.status(HttpCodes.OK).json({ message: 'Successfully Deleted' });
        } catch (error) {
            // pass error to next() function in chain, probably an error-handler or logger
            next(error)
        }
    }
}

export default SeasonController;
