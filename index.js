import express from "express";
import { v4 as uuidv4 } from 'uuid';
import fs from "node:fs/promises";

import * as path from "path";
import { fileURLToPath } from "url";
import Jimp from "jimp";
import { error } from "node:console";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.listen(3000, () => {
    console.log("server listening on http://localhost:3000");
})

//MIDDLEWARE
app.use(express.static("public"));
app.use(express.json());

//ENDPOINTS

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "/public/index.html"));
})

app.post("/api/image/upload", async (req, res) => {
    try {
        let { urlImage } = req.body;
        if (!urlImage) {
            return res.status(400).json({
                msg: "Debe ingresar url de imagen"
            })
        } else {
            uploadImage(urlImage);
            return res.status(200).json({
                code: 200,
                msg: `Imagen cargada con éxito`
            })
        }
    } catch (error) {
        res.status(500).send("Error al procesar y guardar imagen")
    }

});

app.get("/imagenes", async (req, res) => {
    try {
        let rutaImagenes = "./public/storage";
        let files = await fs.readdir(rutaImagenes);
        if (!files) {
            return res.status(404).json({
                msg: "archivo no encontrado"
            })
        } else {
            let fileImage = "";
            files.forEach(file => {
                fileImage = `${file}`
            })

            return res.sendFile(path.resolve(__dirname, `./public/storage/${fileImage}`));
        }



    } catch (error) {
        console.log(error);
    }
});


let idImagen = uuidv4().slice(0, 6);

const uploadImage = (urlImage) => {
    return new Promise((resolve, reject) => {
        Jimp.read(urlImage, async (error, image) => {
            if (error) {
                reject("Error al procesar ruta de imagen");
            }

            let extencion = image._originalMime.split("/")[1];
            let pathImage = path.resolve(__dirname, `./public/storage/${idImagen}.${extencion}`);

            await image
                .resize(350, Jimp.AUTO)
                .grayscale()
                .write(pathImage);

            resolve(`Imagen: ${idImagen}.${extencion} procesada con éxito`)
        });
    })
};




