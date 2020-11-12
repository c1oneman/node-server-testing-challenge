// 1- DEPENDENCIES
// import express from 'express' // package.json needs a "type" key with a value of "module"
const express = require('express') // commonjs module system that came with Node
// import { generate } from 'shortid' // ES6 modules
const generate = require('shortid').generate

// 2- INSTANTIATE AND CONFIGURE THE SERVER
const app = express() // here is our app (our server)
app.use(express.json()) // plugging in a piece of middleware

// 3- DECIDE A PORT NUMBER
const PORT = 5000

// 4- FAKE DATA
let dogs = [
  { id: generate(), name: 'Bicho', breed: 'Maltese' },
]

// 5- ENDPOINTS
// [GET] all dogs in the db
app.get('/dogs', (req, res) => {
  res.status(200).json(dogs)
})

// [GET] dog with the id passed as a parameter in the URL
app.get('/dogs/:id', (req, res) => {
  // 1- pull out the id from the request (the URL param)
  const { id } = req.params
  // 2- find the dog in the dogs arr with the given id
  const dog = dogs.find(dog => dog.id === id)
  // 3- set status code and send back the dog
  if (!dog) {
    res.status(404).json({
      message: `No dog with id ${id}`,
    })
  } else {
    res.status(200).json(dog)
  }
})

// [POST] dog using the request body as raw material
app.post('/dogs', (req, res) => {
  // 1- pull out the { name, breed } from the body of req
  const { name, breed } = req.body
  // 2- make sure the body includes name and breed
  if (!name || !breed) {
    res.status(400).json({
      message: 'Name and breed are required'
    })
  } else {
    // 3- make a new resource, complete with unique id
    const newDog = { id: generate(), name, breed }
    // 4- add the new dog to our fake db
    dogs.push(newDog)
    // 5- send back the newly created resource
    res.status(201).json(newDog) // up to you what to send
  }
})

// [PUT] replace dog with given id (params) with the { name, breed }
app.put('/dogs/:id', (req, res) => {
  // 1- pull id from params
  const { id } = req.params
  // 2- pull name and breed from body
  const { name, breed } = req.body
  // 3- validate id and validate req body
  const indexOfDog = dogs.findIndex(dog => dog.id === id)
  // 4- find the dog and swap "breed" and "name"
  if (indexOfDog !== -1) {
    dogs[indexOfDog] = { id, name, breed }
    // 5- send back the updated dog
    res.status(200).json({ id, name, breed })
  } else {
    res.status(404).json({
      message: `No dog with id ${id}`,
    })
  }
})

// [DELETE] remove dog with given id in the params
app.delete('/dogs/:id', (req, res) => {
  // 1- find dog by the given id
  // 2- remove it from the dogs array
  // 3- send back something
  const { id } = req.params
  try {
    if (!dogs.find(dog => dog.id === id)) {
      res.status(404).json({ message : 'Not found'})
    } else {
      dogs = dogs.filter(dog => dog.id !== id)
      res.status(200).json({ message: `Dog with id ${id} got deleted!`})
    }
    // if there is a crash here
    // instead of the app blowing up
    // the block inside the catch will run
  } catch (error) {
    res.status(500).json({ message: 'Somethign went really bad' })
  }
})
app.get('/', (req, res) => {
    res.status(200).json({ api: 'up' })
  })
// [GET, POST...] catch all endpoint (404 resource not found)
app.all('*', (req, res) => {
  res.status(404).json({ message: 'Not found!' })
})

// 6- LISTEN FOR INCOMING REQUESTS
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`)
})
