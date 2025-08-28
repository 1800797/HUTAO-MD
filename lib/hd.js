const FormData = require("form-data");
const https = require("https");
async function remini(imageBuffer, mode) {
    return new Promise((resolve, reject) => {
        try {
            const supportedModes = ["enhance", "recolor", "dehaze"];
            if (!supportedModes.includes(mode)) mode = "enhance";

            const url = `https://inferenceengine.vyro.ai/${mode}`;
            const formData = new FormData();
            formData.append("model_version", 1);
            formData.append("image", imageBuffer, {
                filename: "enhance_image_body.jpg",
                contentType: "image/jpeg",
            });

            const options = {
                method: "POST",
                headers: {
                    ...formData.getHeaders(),
                    "User-Agent": "okhttp/4.9.3",
                    Connection: "Keep-Alive",
                },
            };

            const req = https.request(url, options, (res) => {
                if (res.statusCode !== 200) {
                    return reject(new Error(`HTTP Error: ${res.statusCode}`));
                }

                const chunks = [];
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("end", () => resolve(Buffer.concat(chunks)));
            });

            req.on("error", (err) => reject(err));
            formData.pipe(req);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.remini = remini;
