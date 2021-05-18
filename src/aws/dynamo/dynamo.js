const AWS = require('aws-sdk')
const table = require('./table')

class Dynamo {
  async connect() {
    const isLocal = process.env.NODE_ENV !== 'production'

    if (!this._connection) {
      let params = {}
      if (isLocal) {
        params = {
          accessKeyId: 'local',
          secretAccessKey: 'local',
          region: 'localhost',
          endpoint: 'http://dynamodb-local:8000',
        }
      } else {
        params = {
          region: 'us-east-1',
        }
      }
      this._connection = new AWS.DynamoDB(params) // use both? Docclient gives better puts and gets, but cant make tables with it... hmm..
      this._docclient = new AWS.DynamoDB.DocumentClient(params)
      if (isLocal) {
        try {
          await this._connection.createTable(table).promise()
        } catch (error) {
          if (error) {
            if (error.code !== 'ResourceInUseException') {
              console.error(error)
            } else {
              console.error(`Table "${table.TableName}" exists`)
            }
          } else {
            console.log(`Created table "${table.TableName}"`)
          }
        }
      }
    }
    console.log('Connected to dynamo')
    return this._connection
  }
  async put(params) {
    return this._docclient.put(params).promise()
  }
  async get(params) {
    return this._docclient.get(params).promise()
  }
  async update(params) {
    return this._docclient.update(params).promise()
  }
  async scan(params = {}) {
    return this._docclient.scan(params).promise()
  }
  async query(params = {}) {
    return this._docclient.query(params).promise()
  }
  async delete(params) {
    return this._docclient.delete(params).promise()
  }
}

module.exports = Dynamo
