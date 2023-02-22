const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const PAT = 'd6471b1f9e6d487cbbb933e280401815';
const USER_ID = 'poschuler';
const APP_ID = 'my-first-application';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const handleGrpcCall = (req, res) => {
  const IMAGE_URL = req.body.input;

  const stub = ClarifaiStub.grpc();

  const metadata = new grpc.Metadata();
  metadata.set('authorization', 'Key ' + PAT);

  stub.PostModelOutputs(
    {
      user_app_id: {
        'user_id': USER_ID,
        'app_id': APP_ID,
      },
      model_id: MODEL_ID,
      version_id: MODEL_VERSION_ID,
      inputs: [
        { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } },
      ],
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        throw new Error(
          'Post model outputs failed, status: ' + response.status.description
        );
      }

      return res.json(response);
    }
  );
};

const handleApiCall = (req, res) => {
  const IMAGE_URL = req.body.input;

  const raw = JSON.stringify({
    'user_app_id': {
      'user_id': USER_ID,
      'app_id': APP_ID,
    },
    'inputs': [
      {
        'data': {
          'image': {
            'url': IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT,
    },
    body: raw,
  };

  fetch(
    'https://api.clarifai.com/v2/models/' +
      MODEL_ID +
      '/versions/' +
      MODEL_VERSION_ID +
      '/outputs',
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => res.status(400).json('unable to work with API'));
};

const handleImage = (db) => (req, res) => {
  const { id } = req.body;

  db('users')
    .where({ id: id })
    .increment({
      entries: 1,
    })
    .returning('entries')
    .then((entries) => {
      return res.json(entries[0].entries);
    })
    .catch((err) => {
      return res.status(400).json('unable to get entries');
    });
};

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall,
  handleGrpcCall: handleGrpcCall,
};
