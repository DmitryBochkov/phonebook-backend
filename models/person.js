const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(reult => {
    console.log('connected to MongoDB')
  })
  .catch(err => {
    console.log('error connecting to MongoDB: ', err.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)