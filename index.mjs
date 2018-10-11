import express from 'express';
import ipfsAPI from 'ipfs-api'
import cors from 'cors'
import bodyParser from 'body-parser'


const app = express();
app.use(cors());
app.use(express.json());

const ipfs = ipfsAPI() 

app.post('/save/', async function (req, res) {

    const isValidSaveRequest = (req, res) => {
        // Check the request body has at least a body.
        console.log(req.body)
        if (!req.body || !req.body['text']) {
            res.status(400);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                error: {
                    id: 'no-body',
                    message: 'blob must have a body'
                }
            }));
            return false;
        }
        return true;
    };
    console.log("valid request:" + isValidSaveRequest(req, res))

    try {
        const result = await ipfs.files.add(new Buffer(req.body['text']));
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));

    } catch(err) {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            error: {
                id: 'unable-to-save-blob',
                message: 'The blob was received but we were unable to save it to ipfs.'
            }
        }));
    }
});

app.get('/get/', async function (req, res) {

    const isValidSaveRequest = (req, res) => {
        // Check the request body has at least a body.
        if (!req.query) {
            res.status(400);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                error: {
                    id: 'no-id',
                    message: 'request must have an ipfsPath'
                }
            }));
            return false;
        }
        return true;
    };
    console.log("valid request:" + isValidSaveRequest(req, res))

    try {
        const result = await ipfs.files.cat(req.query['ipfsPath']);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ data: result.toString('utf8') }));

    } catch(err) {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            error: {
                id: 'unable-to-read-ipfs',
                message: 'The ipfsPath was received but we were unable to get it.'
            }
        }));
    }
});


app.listen(5001, () => console.log('Digger up and listening on port 5001'))
