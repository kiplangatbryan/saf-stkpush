const express  = require('express')

const PORT = 3000 || process.env.PORT

const app = express()

const { getAccessToken, lipaOnline, customerToBs, simulateC2B, callback } = require('./api.js')


app.get('/', async (req, res)=>{
    const access_token =await getAccessToken()
    await lipaOnline(access_token)
    // await customerToBs(access_token)
    // await simulateC2B(access_token)

    return res.json({
        msg: 'something happened!'
    })

})


app.post('/callback', callback)

app.listen(PORT, ()=>{
    console.log(`drive\'s are fired! on port ${PORT}`)
})