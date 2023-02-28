import mongoose, { Model, Schema } from "mongoose";
import UserRoles from "../constants/user.roles.enum";
import UserStatus from "../constants/user.status.enum";
import IUser from "./interfaces/user.interface";

const userSchema: Schema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      minlength: 5,
      maxlength: 18,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 8,
      maxlength: 18,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.USER,
    },
    last_modified_by: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("users", userSchema);

export default UserModel;
