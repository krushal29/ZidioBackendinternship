import mongoose from "mongoose";

const GraphSchema = new mongoose.Schema({
        BarChart:{
            type:Number,
            default:0
        },
        BarChart3D:{
            type:Number,
            default:0
        },
        LineChart:{
            type:Number,
            default:0
        },
        PieChart:{
            type:Number,
            default:0
        },
        DonutChart:{
            type:Number,
            default:0
        },

        ScatterPlot:{
            type:Number,
            default:0
        },
        ScatterPlot3D:{
            type:Number,
            default:0
        },
        Histogram:{
            type:Number,
            default:0
        }
}, { collection: "GraphDetails" });

const GraphDetails = mongoose.model("GraphDetails", GraphSchema);

export default GraphDetails;
