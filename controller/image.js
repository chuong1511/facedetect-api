const Clarifai = require('clarifai');
const clarifai = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

const increaseEntries = (db) => (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      console.log(entries[0]);
      return res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
}

const processImage = () => (req, res) => {
  const { input } = req.body;
  clarifai.models.predict(Clarifai.FACE_DETECT_MODEL, input)
    .then(response => {
      return res.json(response.outputs[0].data.regions[0].region_info.bounding_box);
    })
    .catch(err => res.status(400).json('unable to process image.'));
}

module.exports = {
  increaseEntries: increaseEntries,
  processImage: processImage
}