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
    name: {type: DataTypes.STRING, unique: false, allowNull: true},
    price: {type: DataTypes.JSON, allowNull: true},
    height: {type: DataTypes.INTEGER, allowNull: true},
    age: {type: DataTypes.INTEGER, allowNull: true},
    weight: {type: DataTypes.INTEGER, allowNull: true},
    nation: {type: DataTypes.STRING, allowNull: true},
    boobs: {type: DataTypes.FLOAT, allowNull: true},
    skills: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true},
    img: {type: DataTypes.STRING, allowNull: true},
    address: {type: DataTypes.STRING, allowNull: true},
    about: {type: DataTypes.STRING, allowNull: true},
    phone: {type: DataTypes.STRING, allowNull: true},
    imgType: {type: DataTypes.STRING, allowNull: true},
    comments: {type: DataTypes.ARRAY(DataTypes.JSON), allowNull: true},
})


module.exports = {
    User,
    Girls
}



