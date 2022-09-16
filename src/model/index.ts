import { Schema, model, Model } from "mongoose";

interface IPollution{
    ts: Date,
    aqius: Number,
    mainus: String,
    aqicn: Number,
    maincn: String
}

interface IPollutionModel extends Model<IPollution>{
    maxPollutionTime(): Promise<{date:string}>
}

const PollutionSchema = new Schema<IPollution, IPollutionModel>(
    {
        ts: {
            type: Date,
            required: true
        },
        aqius: {
            type: Number,
            required: true,
            min: 0,
            max: 500
        },
        mainus:{
            type: String,
            trim: true,
            required: true
        },
        aqicn: {
            type: Number,
            required: true,
            min: 0,
            max: 500
        },
        maincn:{
            type: String,
            trim: true,
            required: true
        },
    },
    {timestamps : true}
);

PollutionSchema.static('maxPollutionTime', async function maxPollutionTime(){
    const pollute = await this.find().sort({aqius: -1}).limit(1).exec();
    return {date: pollute[0].ts || ''};
});

const Pollution = model<IPollution, IPollutionModel>('Pollution', PollutionSchema);

export {Pollution, IPollutionModel} ;