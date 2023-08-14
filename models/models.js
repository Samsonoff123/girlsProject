const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Girls = sequelize.define('girls', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: false, allowNull: false},
    price: {type: DataTypes.JSON, allowNull: false},
    height: {type: DataTypes.STRING, allowNull: true},
    age: {type: DataTypes.STRING, allowNull: true},
    weight: {type: DataTypes.STRING, allowNull: true},
    nation: {type: DataTypes.STRING, allowNull: true},
    boobs: {type: DataTypes.STRING, allowNull: true},
    skills: {type: DataTypes.ARRAY, allowNull: true},
    img: {type: DataTypes.STRING, allowNull: true},
    address: {type: DataTypes.STRING, allowNull: true},
    about: {type: DataTypes.STRING, allowNull: true},
    phone: {type: DataTypes.STRING, allowNull: false},
})


module.exports = {
    User,
    Girls
}



