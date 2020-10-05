const m = require('mongoose');

const {Schema} = m;

const NoteSchema = new Schema({
    titulo: {type: String, required: true},
    descripcion: {type: String, required: true},
    date: {type: Date, default: Date.now},
    user: {type: String}
});

module.exports = m.model('Nota', NoteSchema);