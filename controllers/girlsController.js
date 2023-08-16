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
        let {limit, page, lowToHight, hightToLow } = req.query
        let { id } = req.params
        page = page || 1
        limit = limit || 10
        let offset = page * limit - limit

        const sortBy = lowToHight ? 'ASC' : hightToLow ? 'DESC' : 'ASC'

        const devices = await Girls.findAndCountAll({  
            where: {
              typeId: id  
            }, 
            limit, offset,
            order: [
                ['age', sortBy],
            ],
        })


        return res.json(devices)
    }


    async getAllByType(req, res) { 
        let {limit, page } = req.query
        let { id } = req.params
        page = page || 1
        limit = limit || 10
        let offset = page * limit - limit
        const devices = await Girls.findAndCountAll({  
            where: {
              typeId: id  
            }, 
            limit, offset,
            attributes: {
                exclude: ['html', 'variations', 'sliderImg']
            }, 
        })


        return res.json(devices)
    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Girls.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            }
        )

        const similarDevices = await Girls.findAll(
            {
                where: {
                    tag: {
                        [Op.match]: Sequelize.fn('to_tsquery', device.tag.replaceAll(' ', ' & '))
                    }
                },
                attributes: {exclude: ['html', 'sliderImg']}
            }
        )

        const typeDevices = await Girls.findAll(
            {
               where: {
                typeId: device.typeId
               },
               attributes: {exclude: ['html', 'variations', 'sliderImg']}
            }
        )
        return res.json({device, typeDevices, similarDevices})
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

            for(let i = 1; true; i++) {
                    const html = await axios.get(`${link}/${i}`)

                    const root = parse(html.data)

                    const page = root?.querySelectorAll('.box.profilebox') || []

                    setTimeout(() => {
                        page?.forEach(async(p) => {
                            const name = p?.querySelector('.name.h3')?.innerText || ''
                            const price = {
                                html: p?.querySelector('.pricetable').outerHTML
                            }
                            const height = p?.querySelector('.fastdata .grey')?.innerText || ''
                            const age = p?.querySelectorAll('.fastdata')[1]?.querySelector('.grey')?.innerText || ''
                            const weight = p?.querySelectorAll('.fastdata')[0]?.querySelectorAll('.grey')[1]?.innerText || ''
                            const nation = p?.querySelectorAll('.fastdata')[1]?.querySelectorAll('.grey')[1]?.innerText || ''
                            const boobs = p?.querySelectorAll('.fastdata')[0]?.querySelectorAll('.grey')[2]?.innerText || ''
                            const skills = p?.querySelectorAll('.gold li')?.map(e => e.innerText) || []
                            const img = 'https://kiz4dar-kppp.net/img' + p?.querySelector('.picture-box img')?.rawAttrs?.split('/img')[1].split('"')[0] || ''
                            const address = p?.querySelector('.white p')?.innerText || ''
                            const about = p?.querySelectorAll('.white p')[1]?.innerText || ''
                            const phone = p?.querySelector('.phone-box a')?.innerText || ''
                            const imgType = p?.querySelector('.pic-status.m5')?.innerText || ''

                            setTimeout(async() => {
                                await Girls.create({name, price, height, age, weight, nation, boobs, skills, img, address, about, phone, imgType});
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