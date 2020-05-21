import mongoose, { Document, Model } from "mongoose";

import "./User";
import "./Post";

import { IUser } from "./User";
import { IPost } from "./Post";
import { IComment } from "./Comment";

export enum UserNotificationType {
  POST_LIKED,
  POST_COMMENTED,
  USER_FOLLOWED,
}

interface INotificationSchema extends Document {
  from: IUser["_id"];
  for: IUser["_id"];
  type: UserNotificationType;
  post?: IPost["_id"];
  comment?: IComment["_id"];
  read: boolean;
}

export interface INotification extends INotificationSchema {}
export interface INotificationModel extends Model<INotification> {}

export const notificationSchema = new mongoose.Schema<INotification>(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    for: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification, INotificationModel>(
  "Notification",
  notificationSchema
);
