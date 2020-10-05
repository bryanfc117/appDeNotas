const router = require('express').Router();

const Note = require('../models/Notes');
const {isAuthenticated} = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) =>{
    res.render('notes/new-note');
});

//recibir datos
router.post('/notes/new-note',isAuthenticated,async (req, res) => {
    const {titulo, descripcion} = req.body;
    const errors = [];
    if(!titulo){
        errors.push({text: 'Escriba un tìtulo'});
    }
    
    if(!descripcion){
        errors.push({text: 'Escriba una descripción'});
    }
    if(errors.length > 0){
        res.render('notes/new-note', {
            errors,
            titulo,
            descripcion
        });
    }else{
        //instanciar
        const newNote = new Note({titulo, descripcion});
        newNote.user = req.user.id;
        console.log(newNote);
        await newNote.save(); //guarda los datos en la base de datos
        //mensages de error o no
        req.flash('success_msg', 'Nota agregada');


        res.redirect('/notas'); //devuelve a otra pagina
    }
});

//rutas para editar lo guardado
router.get('/notes/edit/:id', isAuthenticated,async (req, res) =>{
    const note = await Note.findById(req.params.id)
    res.render('notes/edit-note', {note});
})


router.get('/notas',isAuthenticated, async (req, res) => {
    await Note.find({user: req.user.id}).sort({date: 'desc'})
    .then(documentos => {
        const contexto = {
            notes: documentos.map(documento =>{
                return{
                    titulo: documento.titulo,
                    descripcion: documento.descripcion,
                    id: documento._id
                }
            })
        }
        res.render('notes/all-notes', {notes: contexto.notes})
    })
});
router.put('/notes/edit-note/:id', isAuthenticated ,async (req, res) =>{
   const {titulo, descripcion} = req.body;
   await Note.findByIdAndUpdate(req.params.id, {titulo, descripcion}) ;
   req.flash('success_msg', 'Nota actualizada');
   res.redirect('/notas');
});

router.delete('/notes/delete/:id',isAuthenticated, async (req, res) =>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota eliminada');

    res.redirect('/notas');
});


module.exports = router;