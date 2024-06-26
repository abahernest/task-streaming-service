import { SchemaOptions, HydratedDocument } from "mongoose";
import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { PasswordUtils } from "../../utils/PasswordUtil.service";

const userSchemaOptions: SchemaOptions = {
  autoIndex: true,
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  virtuals: {
    fullname: {
      get() {
        return this.firstname + " " + this.lastname;
      },
    },
  },
  toObject: { virtuals: true, useProjection: true, versionKey: false },
};

@Schema(userSchemaOptions)
export class User {
  @Prop({ lowercase: true, trim: true, index: true })
  firstname: string;
  @Prop({ lowercase: true, trim: true, index: true })
  lastname: string;
  @Prop({
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;
  @Prop({
    select: false,
    set: (v) => {
      return new PasswordUtils().hashPassword(v);
    },
  })
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;
