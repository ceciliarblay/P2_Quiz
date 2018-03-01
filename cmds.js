
const {log, biglog, errorlog, colorize} = require("./out");
const model = require('./model');

/**
 * Muestra la ayuda
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.helpCmd = rl => {
 	log('Comandos:'); 
  	log('h|help - Muestra esta ayuda.'); 
    log('list - Listar los quizzes existentes.'); 
   	log('show <id> - Muestra la pregunta y la respuesta del quiz indicado.'); 
  	log('add - Añadir un nuevo quiz interactivamente.'); 
  	log('delete <id> - Borrar el quiz indicado.'); 
  	log('edit <id> - Editar el quiz indicado.'); 
  	log('test <id> - Probar el quiz indicado.');
    log('p|play - Jugar a preguntar aleatoriamente todos los quizzes.');
  	log('credits - Créditos.');   
  	log('q|quit - Salir del programa.');
  	rl.prompt();
};

/**
 * Lista todos los quizzes existentes en el modelo.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.listCmd = rl => {
 //log('Listar todos los quizzes existentes.', 'red'); 
  
  model.getAll().forEach((quiz, id) => {
     log(` [${colorize(id, 'magenta')}]: ${quiz.question}`);
  });
  rl.prompt();
};

/**
 * Muestra el quiz indicado en el parametro: la pegunta y la respuesta.
 *
 *
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a mosrar.
 */
exports.showCmd = (rl, id) => {
  //log('Mostrar el quiz indicado.', 'red');
  
  if ( typeof id === "undefined") {
  	errorlog(`Falta el parámetro id.`);
  } else {
  	  try{
  	  	const quiz = model.getByIndex(id);
  	  	log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
  	  } catch(error) {
  	  	  errorlog(error.message);
  	  }
  }

  rl.prompt();
}; 

/**
 * Añade un nuevo quiz al modelo.
 * Pregunta interactivamente por la pregunta y la respuesta.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.addCmd = rl => {
 // log('Añadir un nuevo quiz.', 'red'); 
   
  rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {
    
     rl.question(colorize('Introduzca una respuesta: ', 'red'), answer =>{

        model.add(question, answer);
        log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
        rl.prompt();
      });
   });  
};

/**
 * Borra un quiz del modelo.
 * 
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a borrar en el modelo.
 */
exports.deleteCmd = (rl, id) => {
 // log('Borrar el quiz indicado.', 'red');

  if ( typeof id === "undefined") {
  errorlog(`Falta el parámetro id.`);
  } else {
  	  try{
  	  	model.deleteByIndex(id);
  	  } catch(error) {
  	  	  errorlog(error.message);
  	  }
  }

  rl.prompt(); 
};

/**
 * Edita un quiz del modelo.
 * 
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a editar en el modelo.
 */
exports.editCmd = (rl, id) => {
 // log('Editar el quiz indicado.', 'red'); 
  
  if ( typeof id === "undefined") {
    errorlog(`Falta el parámetro id.`);
    rl.prompt();
  } else {
  	  try{
  	  	const quiz = model.getByIndex(id);

  	  	process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);	
  	  	
  	  	rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {

  	  		process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
  	  
  	  		rl.question(colorize('Introduzca la respuesta: ', 'red'), answer => {
  	  			model.update(id, question, answer);
  	  			log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
  	  			rl.prompt();
  	  		});	
  	  	});
  	} catch(error) {
  	  	errorlog(error.message);
  	  	rl.prompt();
  	}
  }

};

/**
 * Prueba un quiz, es decir, hace una pregunta del modelo a la que debemos constestar.
 * 
 * @param rl Objeto readline usado para implementar el CLI.
 * @param id Clave del quiz a probar.
 */
exports.testCmd = (rl, id) => {
  //log('Probar el quiz indicado.', 'red'); 
  //rl.prompt();

   if ( typeof id === "undefined") {
    errorlog(`Falta el parámetro id.`);
    rl.prompt();
  } else {
  	  try{
  	  	const quiz = model.getByIndex(id);
	
  	  		rl.question(colorize(`${quiz.question}?: `, 'red'), answer1 => {
  	  			
  	  			answer=answer1.trim();

  	  			if(answer === quiz.answer){
  	  				log('Su respuesta es correcta.')
  	  				biglog('Correcta', 'green');
  	  				rl.prompt();
  	  			} else {
  	  				log('Su respuesta es incorrecta.')
  	  				biglog('Incorrecta', 'red');
  	  				rl.prompt();
  	  			}
  	  		});
  	 	
  	} catch(error) {
  	  	errorlog(error.message);
  	  	rl.prompt();
  	}
  }

};

/**
 * Pregunta todos los quizzes existentes en el modelo en orden aleatorio.
 * Se gana si se contesta a todos satisfactoriamente.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.playCmd = rl => {
  log('Jugar.', 'red'); 
  rl.prompt();
};

/**
 * Muesta los nombres de los autores de la práctica.
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.creditsCmd = rl => {
  log('Autora de la práctica:');
  log('Cecilia Rodrigo Blay', 'green');
  rl.prompt();
};

/**
 * Terminar el programa
 *
 * @param rl Objeto readline usado para implementar el CLI.
 */
exports.quitCmd = rl => {
	rl.close();
};