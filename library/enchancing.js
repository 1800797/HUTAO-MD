const axios = require('axios')
const chalk = require('chalk')
const cheerio = require("cheerio")
const FormData = require('form-data')
const fs = require('fs')
const fetch = require('node-fetch')
const path = require('path')

async function upScale(path, pulsar, m, chatId) {
  try {
    const form = new FormData();
    form.append("image", fs.createReadStream(path));
    form.append("scale", 2);

    const headers = {
      ...form.getHeaders()
    };

    const { data } = await axios.post("https://api2.pixelcut.app/image/upscale/v1", form, { headers, responseType: 'arraybuffer' });

    await pulsar.sendMessage(chatId, { image: Buffer.from(data) }, {quoted: m})
  } catch (error) {
    console.error(error);
  }
}

const getTaskId = async () => {
  const {
    data: html
  } = await axios.get('https://www.iloveimg.com/id/hapus-latar-belakang')
  api.defaults.headers.post['authorization'] = `Bearer ${html.match(/ey[a-zA-Z0-9?%-_/]+/g)[1]}`
  return html.match(/taskId = '(\w+)/)[1]
}

const uploadImageToServer = async (imageBuffer) => {
  const taskId = await getTaskId()

  const fileName = Math.random().toString(36).slice(2) + '.jpg'
  const form = new FormData()
  form.append('name', fileName)
  form.append('chunk', '0')
  form.append('chunks', '1')
  form.append('task', taskId)
  form.append('preview', '1')
  form.append('pdfinfo', '0')
  form.append('pdfforms', '0')
  form.append('pdfresetforms', '0')
  form.append('v', 'web.0')
  form.append('file', imageBuffer, fileName)

  const reqUpload = await api.post('/v1/upload', form, {
      headers: form.getHeaders()
    })
    .catch(e => e.response)
  if (reqUpload.status !== 200) throw reqUpload.data || reqUpload.statusText

  return {
    serverFilename: reqUpload.data.server_filename,
    taskId
  }
}

const removeBg = async (imageBuffer, responseType = 'arraybuffer') => {
  const {
    serverFilename,
    taskId
  } = await uploadImageToServer(imageBuffer)

  const form = new FormData()
  form.append('task', taskId)
  form.append('server_filename', serverFilename)

  const reqRmbg = await api.post('/v1/removebackground', form, {
    headers: form.getHeaders(),
    responseType
  }).catch(e => e.response)
  const type = reqRmbg.headers['content-type']
  if (reqRmbg.status !== 200 || !/image/.test(type))
    throw JSON.parse(reqRmbg.data?.toString() || '{"error":{"message":"An error occurred"}}')

  return reqRmbg.data
}

async function remini(imageData, action) {
  return new Promise(async (resolve, reject) => {
    let actions = ['enhance', 'recolor', 'dehaze'];
    if (!actions.includes(action)) {
      action = actions[0];
    }

    let formData = new FormData();
    let url = `https://inferenceengine.vyro.ai/${action}`;

    formData.append('model_version', 1, {
      'Content-Transfer-Encoding': 'binary',
      'contentType': 'multipart/form-data; charset=uttf-8'
    });

    formData.append('image', Buffer.from(imageData), {
      'filename': 'enhance_image_body.jpg',
      'contentType': 'image/jpeg'
    });

    formData.submit({
      'url': url,
      'host': 'inferenceengine.vyro.ai',
      'path': `/${action}`,
      'protocol': 'https:',
      'headers': {
        'User-Agent': 'okhttp/4.9.3',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip'
      }
    }, function (err, res) {
      if (err) {
        reject();
        return;
      }

      let chunks = [];
      res.on('data', chunk => {
        chunks.push(chunk);
      }).on('end', () => {
        resolve(Buffer.concat(chunks));
      }).on('error', () => {
        reject();
      });
    });
  });
}

module.exports = {
  upScale,
  removeBg,
  remini
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)})