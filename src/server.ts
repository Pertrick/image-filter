import express from 'express';
import bodyParser from 'body-parser';
  
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();
  const validUrl = require('valid-url');
  const fs = require('fs');
  const path = require('path');
 

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get('/filteredimage/', async(req, res, next) =>{

    const imageUrl = req.query.image_url; 


    if(validUrl.isUri(imageUrl)){

      console.log(imageUrl);
       filterImageFromURL(imageUrl).then((filteredPath) =>{

        console.log(filteredPath);
          
        res.sendFile(filteredPath,[], function (err) {
          if (err) {
            res.send(err);
          } else {

            const files = fs.readdirSync(__dirname + "\\util\\tmp\\");

            for(var i =0; i <files.length; i++){
    
              files[i] =  __dirname + "\\util\\tmp\\" + files[i];
            }
    
            deleteLocalFiles(files);
              
          }
      });

       }, () => {
         res.send('Failed to save image to path')
       });



    //    var fileName = 'GeeksforGeeks.txt';
    // res.sendFile(fileName, options, function (err) {
    //     if (err) {
    //         next(err);
    //     } else {
    //         console.log('Sent:', fileName);
    //         next();
    //     }
    // });    
  
       
    } else {
      res.send('Not a URI! Kindly enter a valid URI.');
    }

    // const files = fs.readdirSync("src/util/tmp");

    // await deleteLocalFiles(files);

  });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();