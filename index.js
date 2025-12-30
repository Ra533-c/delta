import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/user.js";
import ejs from "ejs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/read", async (req, res) => {
    let allUser = await User.find();
    res.render("read", { allUser: allUser });
})

app.post("/create", async (req, res) => {
    try {
        const { name, email, image } = req.body;
        console.log(`${name} , ${email} , ${image}`);

        const user = await User.create({
            name,
            email,
            image
        });

        res.redirect("/read");
        console.log("User created successfully!", user);
    } catch (err) {
        console.log("Error creating user:", err);
        res.status(500).send("Something went wrong while creating the user.");
    }
});

app.get("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        console.log("User deleted successfully!", deletedUser);
        res.redirect("/read");
    } catch (err) {
        console.log("Error deleting user:", err);
        res.status(500).send("something went wrong while deleting the user.");
    }
})


app.listen(port, () => { console.log(`Server is running on port ${port}`) });    