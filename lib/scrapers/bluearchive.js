const ws = require("ws");

class BlueArchive {
    async voice(text, model = "Airi", speed = 1.2) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!text || text.length >= 500) 
                    throw new Error("Text tidak valid atau melebihi 500 karakter!");
                if (speed && (speed < 0.1 || speed > 2)) 
                    speed = 2;

                model = "JP_" + model;
                const base_url = "https://ori-muchim-bluearchivetts.hf.space/";
                const session_hash = this.generateSession();
                const socket = new ws("wss://ori-muchim-bluearchivetts.hf.space/queue/join");

                socket.on("message", (data) => {
                    const d = JSON.parse(data.toString("utf8"));
                    switch (d.msg) {
                        case "send_hash": {
                            socket.send(JSON.stringify({
                                fn_index: 0,
                                session_hash,
                            }));
                            break;
                        }
                        case "send_data": {
                            socket.send(JSON.stringify({
                                fn_index: 0,
                                session_hash,
                                data: [text, model, speed],
                            }));
                            break;
                        }
                        case "process_completed": {
                            const output = d.output;
                            const name = output.data[1]?.name;
                            socket.close();
                            resolve({
                                text,
                                model,
                                speed,
                                result: {
                                    duration: +output.duration.toFixed(2),
                                    path: name,
                                    url: base_url + "file=" + name,
                                },
                            });
                            break;
                        }
                        default:
                            console.log(`Unexpected message: ${data.toString("utf8")}`);
                            break;
                    }
                });
            } catch (error) {
                reject(`Error in voice process: ${error.message}`);
            }
        });
    }

    generateSession() {
        return Math.random().toString(36).substring(2);
    }
}

module.exports = BlueArchive;