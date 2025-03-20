import mongoose, { Schema, Document } from 'mongoose';

export interface IFaculty extends Document {
    name: string;  
    code: string;  
}

const FacultySchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true }, 
        code: { type: String, required: true, unique: true }, 
    },
    { timestamps: true } 
);

export default mongoose.model<IFaculty>('Faculty', FacultySchema);
