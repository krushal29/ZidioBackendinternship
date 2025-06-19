import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { CountGraph, getCountGraph } from "../controllers/GraphController.js";

const GraphRoute = Router();

GraphRoute.post('/CountGraph', verifyToken, CountGraph);


GraphRoute.get('/getCountGraph', verifyToken, getCountGraph);

export default GraphRoute