import express from 'express'
import cors from 'cors'
import { PORT } from './config/env.js';
import productRouter from './routes/product.routes.js';
import connectToDatabase from './database/mongodb.js';
import { fileURLToPath } from 'url';
import path from 'path';


const app = express();


app.use(cors());
app.use(express.json());
// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static image files
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/products', productRouter);

app.get('/', (req,res) => {
    res.send("Welcome to the traderjoeslist API");
})

app.listen(PORT, async () => {
    console.log(`Server running on port: ${PORT}`);
    await connectToDatabase();
})



