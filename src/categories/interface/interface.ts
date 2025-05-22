import { Types } from "mongoose";

interface CategoryWithCount{
    _id:Types.ObjectId,
    name:string,
    image:string,
    createdAt:number,
    updatedAt:number,
    status:string,
    isDelete:boolean,
    count?:number
}

export interface CategoryResponse {
    status: number;
    message: string;
    data: Array<CategoryWithCount>;
    count?: number;
    isNextPageAvailable:boolean
}