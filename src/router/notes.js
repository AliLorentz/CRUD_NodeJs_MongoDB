const express = require('express');
const router = express.Router();

const Note=require('../models/Notes');
const {isAuthenticated}=require('../helpers/auth');

router.get('/note/add',isAuthenticated,(req,res)=>{
	res.render('notes/new-notes');
});

router.post('/notes/new-note',isAuthenticated,async(req,res)=>{
	const {title,description}=req.body;
	const errors=[];
	if(!title){
		errors.push({text:'Please write a title'});
	}
	if(!description){
		errors.push({text:'please Write a Description'});
	}
	if(errors.length>0){
		res.render('notes/new-notes',{
			errors,
			title,
			description
		});
	}else{
		const newNote=new Note({title,description});
		newNote.user=req.user.id;//id para las notas
		await newNote.save();
		//Guarda los datos en la base de datos
		req.flash('success_msg','Nota agregada con exito')
		res.redirect('/notes')
	}
});

router.get('/notes',isAuthenticated, async (req, res) => {
    await Note.find({user:req.user.id}).sort({date:'desc'})
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
            	id:documento.id,
                title: documento.title,
                description: documento.description
            }
          })
        }
        res.render('notes/all-notes', {
			 notes: contexto.notes }) 
      });
  });

router.get('/notes/edit/:id', isAuthenticated,async (req,res) =>{
	const note = await Note.findById(req.params.id);
	const{title,description,id}=note;
	console.log(note)
	res.render('notes/edit-notes',{title:title, description:description, id:id});
});

router.put('/notes/edit-notes/:id' , isAuthenticated,async (req,res)=>{
	const {title,description} = req.body;
	await Note.findByIdAndUpdate(req.params.id,{title,description});
	req.flash('success_msg','Nota editada exitosamente')
	res.redirect('/notes');
});

router.delete('/notes/delete/:id',isAuthenticated, async (req,res)=>{
	await Note.findByIdAndDelete(req.params.id);
	req.flash('success_msg','Nota eliminada exitosamente')
	res.redirect('/notes');
});

module.exports = router;