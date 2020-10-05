const m = require('mongoose');
const bcrypt = require('bcryptjs'); // requiere la encriptacion
const {Schema} = m;

const UserSchema = new Schema({
    nombre: {type: String, required: true},
    email: {type: String, required: true},
    contrasena: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

UserSchema.methods.encryptContrasena = async (contrasena) => {
    const salt = await bcrypt.genSalt(10); //se aplica el algoritmo
    const hash = bcrypt.hash(contrasena, salt); //se encypta la contraseña con el hash
    return hash;
};

UserSchema.methods.comparaContrasena = async function(contrasena){ //no se usa funcion de flecha por que se necesita acceder a traves de this en UserSchema
return await bcrypt.compare(contrasena, this.contrasena);
};

 module.exports = m.model('User', UserSchema);