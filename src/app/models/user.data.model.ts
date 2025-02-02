import mongoose, { Model, Schema } from "mongoose";
import IUserData from "./interfaces/user.data.interface";

const userDataSchema: Schema<IUserData> = new Schema<IUserData>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'userId is required to init userData'],
      unique: true,
      index: true,
    },
    seenTitles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "title",
        },
      ],
      default: [],
    },
    unseenTitles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "title",
        },
      ],
      default: [],
    },
    starredTitles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "title",
        },
      ],
      default: [],
    },
    favouriteTitles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "title",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    collection: "userData",
  }
);

const UserDataModel: Model<IUserData> = mongoose.model<IUserData>(
  "UserData",
  userDataSchema
);

export default UserDataModel;
