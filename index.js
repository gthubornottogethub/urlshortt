const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const yup = require("yup");
const monk = require("monk");
const { nanoid } = require("nanoid");
require("dotenv").config();

const db = monk(process.env.MONGODB_URI);
const urls = db.get("urls");
urls.createIndex({ slug: 1 }, { unique: true });

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static("./public")); // Serve static files from the public directory
app.use(morgan("tiny"));

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});

app.get("/:slug", async (req, res, next) => {
    const { slug } = req.params;
    try {
        const url = await urls.findOne({ slug });
        if (url) {
            return res.redirect(url.url);
        }
        return res.redirect(`/?error=${slug} not found`);
    } catch (err) {
        return next(err);
    }
});

app.post("/url", async (req, res, next) => {
    let { url } = req.body;
    try {
        const slug = nanoid(5).toLowerCase();

        await schema.validate({ slug, url });

        const existing = await urls.findOne({ slug });
        if (existing) {
            throw new Error("Slug is already in use");
        }

        const newUrl = {
            url,
            slug,
        };

        await urls.insert(newUrl);
        return res.json(newUrl);
    } catch (error) {
        return next(error);
    }
});

app.use((error, req, res, next) => {
    const status = error.status || 500;
    res.status(status);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? "🥞" : error.stack,
    });
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});