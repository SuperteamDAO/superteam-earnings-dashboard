// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import graph_data from '../../lib/graph.json'

let API = 'https://api.steinhq.com/v1/storages/63bd9d99eced9b09e9b23f66/Sheet1';

export default async function handler(req, res) {

  let api_req = await axios.put(`${API}`, {
    "condition": { "data": "graph" },
    "set": { "value": JSON.stringify(graph_data) },
  });

  res.status(200).json(api_req.data)
}
