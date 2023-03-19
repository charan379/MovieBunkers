import IUserData from "@models/interfaces/IUserData";
import UserDataModel from "@models/UserData.model";
import { Model, Schema, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import IUserDataRepository from "./interfaces/userdata.repository.interface";



@Service()
class UserDataRepository implements IUserDataRepository {

    private userDataModel: Model<IUserData>;

    constructor() {
        this.userDataModel = UserDataModel;
    }

    async create(userData: Partial<IUserData>): Promise<IUserData> {
        return this.userDataModel.create<Partial<IUserData>>(userData);

    }
    async findByUserId(userId: Schema.Types.ObjectId): Promise<IUserData | null> {
        return this.userDataModel
            .findOne({ userId: userId }, { __v: 0 })
            .exec();
    }

    async updateUserData(userId: Schema.Types.ObjectId, update: UpdateQuery<IUserData>): Promise<boolean> {

        const result = await this.userDataModel.findOneAndUpdate({ userId: userId }, update, { new: true }).exec();
        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async findAll(): Promise<IUserData[]> {

        return await this.userDataModel.find({}, { __v: 0 })
            .populate({
                path: 'userId',
                model: 'user',
                localField: 'userId',
                foreignField: '_id',
                select: "userName email status role createdAt",
            }).exec()

        // return await this.userDataModel.aggregate([
        //     // {
        //     //     $match: {
        //     //       userId: userId
        //     //     }
        //     //   },
        //     {
        //         $lookup: {
        //             from: 'users',
        //             localField: 'userId',
        //             foreignField: '_id',
        //             as: 'user'
        //         }
        //     }, {
        //         $addFields: {
        //             user: {
        //                 $arrayElemAt: [
        //                     '$user', 0
        //                 ]
        //             }
        //         }
        //     }
        // ]).exec();
    }

}

export default UserDataRepository;