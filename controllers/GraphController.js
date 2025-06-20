import GraphDetails from "../models/GraphModel.js";


const CountGraph = async (req, res) => {
    try {
        const { graphType, graphDimension } = req.body;

        if (graphType == "bar" && graphDimension == '3d') {
            await GraphDetails.updateOne({}, { $inc: { BarChart3D: 1 } },{upsert:true})
            return res.status(200).json({data:true})
        }
        else if (graphType == "scatter" && graphDimension == '3d') {
            await GraphDetails.updateOne({}, { $inc: { ScatterPlot3D: 1 } },{upsert:true})
            return res.status(200).json({data:true})
        }
        else if (graphType == "bar") {
            await GraphDetails.updateOne({}, { $inc: { BarChart: 1 } },{upsert:true})
            return res.status(200).json({data:true})
        }
        else if (graphType == "line") {
            await GraphDetails.updateOne({}, { $inc: { LineChart: 1 } },{upsert:true})
            return res.status(200).json({data:true})
        }

        else if (graphType == "scatter") {
            await GraphDetails.updateOne({}, { $inc: { ScatterPlot: 1 } },{upsert:true})
            return res.status(200).json({data:true})
        }

        else if (graphType == "pie") {
            await GraphDetails.updateOne({}, { $inc: { PieChart: 1 } },{upsert:true})
            return res.status(200).json({data:true})
        }

        else if (graphType == "donut") {
            await GraphDetails.updateOne({}, { $inc: { DonutChart: 1 } },{upsert:true})
            return res.status(200).json({data:true})
        }

        else if (graphType == "histogram") {
            await GraphDetails.updateOne({}, { $inc: { Histogram: 1 } },{upsert:true})
            return res.status(200).json({data:true})
        }
        else {
            return res.status(400).json({ data: false, message: "Invalid graph type or dimension" });
        }

    } catch (e) {
        return res.status(500).json({ data: false, message: "Server Error", error: e.message })
    }
}


const getCountGraph=async(req,res)=>{
    try{
        
        const GraphCountData=await GraphDetails.find({});
        return res.status(200).json({data:true,message:GraphCountData})
    }catch(e){
         return res.status(500).json({ data: false, message: "Server Error", error: e.message })
    }
}

export  {CountGraph,getCountGraph}