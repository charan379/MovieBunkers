import { IEpisode } from "@models/interfaces/episode.interface";
import { Types } from "mongoose";



interface IEpisodeRepository {
    findByTvSeasonId(tvShowId: Types.ObjectId, seasonId: Types.ObjectId): Promise<IEpisode[]>;
    updateById(tvShowId: Types.ObjectId, seasonId: Types.ObjectId, update: Partial<IEpisode>): Promise<IEpisode | null>;
    deleteById(id: Types.ObjectId): Promise<void>;
    deleteManyByTvSeasonId(tvShowId: Types.ObjectId, seasonId: Types.ObjectId): Promise<void>;
    deleteManyByTvShowId(tvShowId: Types.ObjectId): Promise<void>;
}

export default IEpisodeRepository;