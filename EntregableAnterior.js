const fs = require('fs');
const path = require("path");

module.exports = class Contenedor {
    constructor(nombre) {
        this.nombre = nombre;
    }

    async save (Object) {
        try {
            let array = JSON.parse(await this.readAll());
            let id_asignado = getMaxId(array);
            Object.id = id_asignado;
            array.push(Object);

            let written = await this.write(JSON.stringify(array, null, 2));
            if(written){
                return "Objeto agregado";
            }
        } catch (err) {
            console.log(err);
        }
    };

    async readAll () {
        try {
            let content = await fs.promises.readFile(path.join(__dirname, this.nombre), "utf-8");
            let array = getArrayFromJsonContent(content);
            return array;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    async getRandom () {
        let arr = await this.readAll();
        let r = Math.floor(Math.random() * (arr.length)) + 1;
        return arr.filter(prod => prod.id == r);
    }

    async getById (id) {
        let array = JSON.parse(await this.readAll()).filter(x => x.id == id);
        console.log(JSON.stringify(array, null, 2));
        return array.length <= 0 ? "No existe el objeto" : array;
    };

    async updateById (id, object) {
        let array = JSON.parse(await this.readAll());
        if(array.filter(x => x.id == id).length > 0){
            array.map(obj => {
                if(obj.id == id){
                    obj.price = object.price;
                    obj.title = object.title;
                    obj.thumbnail = object.thumbnail;
                }
            })
            this.write(JSON.stringify(array, null, 2));
            return array.length <= 0 ? "No existe el objeto" : array;
        }else{
            return "No existe el objeto";
        }
    };

    async deleteById (id) {
        let array = JSON.parse(await this.readAll());
        const index = array.indexOf(array.filter(x => x.id == id)[0]);
        if (index > -1) {
            array.splice(index, 1);
            let written = await this.write(JSON.stringify(array, null, 2));
        }else{
            return "No existe el objeto";
        }
    };

    async deleteAll () {
        await this.write("[]");
    };

    async write (content) {
        let result = true;
        await fs.promises.writeFile(this.nombre, content, error =>{
            if(error){
                result = false;
            }
        });
        return result;
    }

}
const getMaxId = (array) => {
    let id_asignado = array.length + 1;
    if (array.length == 0) {
        id_asignado = 1;
    }
    else {
        while (true) {
            if (!array.indexOf(id_asignado)) {
                id_asignado += 1;
            } else {
                break;
            }
        }
    }
    return id_asignado;
};

const getArrayFromJsonContent = (content) => {
    let array = [];
    try {
        if (content.length > 0) {
            array = content;
        }
    } catch (ex) {
        array = [];
    }
    return array;
};