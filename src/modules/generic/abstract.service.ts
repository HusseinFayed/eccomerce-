import { Logger, Type } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { OBaseEntity } from "./base.entity";
// import { OBaseEntity } from "../shared/o-base-entity";

const log = new Logger('AbstractService');


export function ServiceFactory<E extends OBaseEntity>(
    model: Type<E>
): any {
    class AbstractService<E extends OBaseEntity> {
        constructor(
            @InjectConnection() private connection: Connection,
            // @InjectModel(model.name) private OFileModel: Model<E>,

        ) {
        }


        public get DataModel() {
            return this.connection.model<E>(model.name)
        }


        async saveOne(body: E): Promise<E> {
            let saved = await this.DataModel.create(body);
            return saved;
        }



        async findAll(): Promise<E[]> {
            return await this.DataModel.find();
        }



        async existsByCode(code: string): Promise<boolean> {
            return await this.DataModel.countDocuments({ code: code }) > 0;
        }


        async count(): Promise<number> {
            return this.DataModel.countDocuments();
        }

        async findById(id: string): Promise<E> {
            return this.DataModel.findById(id);
        }


        async updateOne(id: string, body: E): Promise<E> {
            return this.DataModel.findByIdAndUpdate(id, { $set: body }, { new: true, multi: true, });
        }


        async deleteOne(id: string): Promise<E> {
            return this.DataModel.findByIdAndDelete(id);
        }
    }

    return AbstractService;
}
