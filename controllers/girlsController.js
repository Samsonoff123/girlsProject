const uuid = require('uuid')
const path = require('path')
const { Device, DeviceInfo, Girls } = require('../models/models')
const ApiError = require('../error/ApiError')
const axios = require('axios')
const {parse} = require('node-html-parser')
const  { Op, Sequelize } = require("sequelize");

class GirlsController {
    async create(req, res, next) {
        console.log(req.body.variations);
        try {
            let {name, price, tag, brandId, typeId, img, html, variations, sliderImg, url} = req.body  
 
            const device = await Girls.create({ name, price, tag, brandId, typeId, img, html, variations, sliderImg, url })
            
            // if (info) {
            //     info = JSON.parse(info) 
            //     info.forEach(i => 
            //         DeviceInfo.create({
            //             title: i.title, 
            //             description: i.description, 
            //             deviceId: device.id
            //         })
            //     )
            // }  
     
            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e))
        }   
    }  
  
    async getAll(req, res) {
        let {limit, page } = req.query
        page = page || 1
        limit = limit || 100
        let offset = page * limit - limit
        
        let devices = await Girls.findAndCountAll({limit, offset,})
        return res.json(devices)
    }

    async getByAge(req, res) {
        console.log("test");
        let {limit, page, lowToHight, hightToLow } = req.query
        page = page || 1
        limit = limit || 100
        let offset = page * limit - limit

        lowToHight = !!lowToHight || false
        hightToLow = !!hightToLow || false

        const sortBy = lowToHight ? 'ASC' : hightToLow ? 'DESC' : 'ASC'

        const devices = await Girls.findAndCountAll({  
            limit, offset,
            order: [
                ['age', sortBy],
            ],
        })
        return res.json(devices)
    }

    async getByWeight(req, res) {
        let {limit, page, lowToHight, hightToLow } = req.query
        page = page || 1
        limit = limit || 100
        let offset = page * limit - limit

        lowToHight = !!lowToHight || false
        hightToLow = !!hightToLow || false

        const sortBy = lowToHight ? 'ASC' : hightToLow ? 'DESC' : 'ASC'

        const devices = await Girls.findAndCountAll({  
            limit, offset,
            order: [
                ['weight', sortBy],
            ],
        })
        return res.json(devices)
    }

    async getByHeight(req, res) {
        let {limit, page, lowToHight, hightToLow } = req.query
        page = page || 1
        limit = limit || 100
        let offset = page * limit - limit

        lowToHight = !!lowToHight || false
        hightToLow = !!hightToLow || false

        const sortBy = lowToHight ? 'ASC' : hightToLow ? 'DESC' : 'ASC'

        const devices = await Girls.findAndCountAll({  
            limit, offset,
            order: [
                ['height', sortBy],
            ],
        })
        return res.json(devices)
    }

    async getByHeight(req, res) {
        let {limit, page, lowToHight, hightToLow } = req.query
        page = page || 1
        limit = limit || 100
        let offset = page * limit - limit

        lowToHight = !!lowToHight || false
        hightToLow = !!hightToLow || false

        const sortBy = lowToHight ? 'ASC' : hightToLow ? 'DESC' : 'ASC'

        const devices = await Girls.findAndCountAll({  
            limit, offset,
            order: [
                ['height', sortBy],
            ],
        })
        return res.json(devices)
    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Girls.findOne(
            {
                where: {id},
            }
        )

        return res.json(device)
    }

    async update (req, res) {
        try {
            const devices = await Girls.findAll()

            devices.forEach(async(d) => {
                const age = d.age
                const weight = d.weight
                const boobs = d.boobs

                await Girls.update(
                    { 
                        age: age ? +age : age,
                        weight: weight ? weight.split('кг')[0] : weight,
                        boobs: boobs ? +boobs : boobs
                     },
                    { where: { id: d.id } }
                )
            })
    


            
            
            return res.json('success')
    
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Не удалось получить девайс'
            })
        }
    }

    async remove (req, res) {
        try {
            console.log(req.params.id);
            const postId = req.params.id
    
            await Girls.destroy({
                where: {id: postId},
            })

            const devices = await Girls.findAll()
            
            return res.json(devices)
    
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Не удалось получить девайс'
            })
        }
    }

    async parse(req, res, next) {
        try {
            let { link } = req.body 

            for(let i = 1; i < 45; i++) {
                    const html = await axios.get(`${link}/${i}`)

                    const root = parse(html.data)

                    const page = root?.querySelectorAll('.box.profilebox') || []

                    setTimeout(() => {
                        page?.forEach(async(p) => {
                            const name = p?.querySelector('.name.h3')?.innerText || ''
                            const price = {
                                html: p?.querySelector('.pricetable').outerHTML
                            }
                            const height = +p?.querySelector('.fastdata .grey')?.innerText.split('см')[0] || 160
                            const age = +p?.querySelectorAll('.fastdata')[1]?.querySelector('.grey')?.innerText || 18
                            const weight = +p?.querySelectorAll('.fastdata')[0]?.querySelectorAll('.grey')[1]?.innerText.split('кг')[0] || 60
                            const nation = p?.querySelectorAll('.fastdata')[1]?.querySelectorAll('.grey')[1]?.innerText || ''
                            const boobs = +p?.querySelectorAll('.fastdata')[0]?.querySelectorAll('.grey')[2]?.innerText || 0.0
                            const skills = p?.querySelectorAll('.gold li')?.map(e => e.innerText) || []
                            const img = 'https://kiz4dar-kppp.net/img' + p?.querySelector('.picture-box img')?.rawAttrs?.split('/img')[1].split('"')[0] || ''
                            const address = p?.querySelector('.white p')?.innerText || ''
                            const about = p?.querySelectorAll('.white p')[1]?.innerText || ''
                            const phone = p?.querySelector('.phone-box a')?.innerText || ''
                            const imgType = p?.querySelector('.pic-status.m5')?.innerText || ''

                            setTimeout(async() => {
                                await Girls.create({name, price, height, age, weight, nation, boobs, skills, img, address, about, phone, imgType, comments: []});
                            }, 800);
                        })
                    }, 800)
                console.log(i);

            }

            return res.json("sucsess")

        } catch (e) {
            return res.json({error: e})
            next(ApiError.badRequest(e))
        }
    }

}

module.exports = new GirlsController()