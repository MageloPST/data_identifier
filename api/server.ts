import * as BodyParser from 'body-parser'
import * as express from 'express'
import { MongoClient } from 'mongodb'
import { checkData, executePreviousFilters, parseJson } from './src/utils'
const PORT = 5000
const app = express()
const DATABASE_NAME = 'data_identifier'
const CONNECTION_URL = 'mongodb://root:password@172.29.207.173:27017/'

app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))
// for parsing multipart/form-data
app.use(express.static('public'))
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

var database, constants, collection

app.get('/', async (_req, res) => {
  res.json({
    code: 200,
    message: 'Hackaton API is running ok!'
  })
})

app.post('/check-pattern', async (request, response) => {
  if (Object.entries(request.files['jsons']).length === 0) {
    response.status(400).json({ code: 400, message: 'json files is required' })
    return
  }

  const files = request.files['jsons']

  const result: any = {}

  let count = 0
  // tslint:disable-next-line: forin
  for (const _body in files) {
    const values = parseJson(_body)

    // tslint:disable-next-line: no-console
    console.log(values)

    const _values = await first_value_filter(values)
    const _match = _values['match']
    const _next = _values['next']
    const _others = await continueValueFilter(_next)
    result[count] = _match.concat(_others)
    count++
  }
  response.json(result)
})

async function first_value_filter(values) {
  const _nextValues = []
  const _matchedData = []

  await constants.find({}).toArray((error, constants) => {
    if (error) {
      return false
    }
    values.forEach(function(item, _index) {
      const fixedFilters = executePreviousFilters(item, constants)
      // tslint:disable-next-line: no-console
      // console.log(fixedFilters)
      if (fixedFilters !== false) {
        _matchedData.push(fixedFilters)
      } else {
        _nextValues.push(item)
      }
    })
  })

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        match: _matchedData,
        next: _nextValues
      })
    }, 1000)
  })
}

const continueValueFilter = async values => {
  const _matchedData = []

  await collection.find({}).toArray((error, regexObject) => {
    if (error) {
      return false
    }
    values.forEach(function(item, _index) {
      const _aux = {}
      _aux['data'] = item
      // tslint:disable-next-line: prefer-for-of
      regex_loop: for (let i = 0; i < regexObject.length; i++) {
        const _regex = regexObject[i]['regular_expression']
        let counts = 0
        // tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < _regex.length; j++) {
          const match = checkData(item, _regex[j])
          if (match) {
            counts = counts + 1
            // _aux['regex'] = regexObject[i]['regular_expression'];
            // _matched_data.push(_aux);
            // break regex_loop;
          }
        }
        if (counts > 0) {
          _aux['type'] = regexObject[i]['type']
          // _aux['counts'] = counts;
        } else {
          _aux['type'] = 'text'
        }
        // _matched_data.push(_aux);
      }
      _matchedData.push(_aux)
    })
  })

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(_matchedData)
    }, 1000)
  })
}

app.listen(PORT, () => {
  // tslint:disable-next-line: no-console
  console.log(`Listening on ${PORT}`)
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error
      }
      database = client.db(DATABASE_NAME)
      constants = database.collection('constants')
      collection = database.collection('patterns')
      // tslint:disable-next-line: no-console
      console.log('Connected to `' + DATABASE_NAME + '`!')
    }
  )
})
