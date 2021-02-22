import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

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
  //! END @TODO1
  app.get("/filteredimage", async (req: express.Request, res: express.Response) =>{
    const image_url = req.query.image_url
    // validate the images
    if (!image_url) {
      return res.status(400).send({message: 'Invalid url parameter'})
    }

    // filter the images on the server
    const filterPath = await filterImageFromURL(image_url)    
    res.sendFile(filterPath)

    // set time out to remove the image after the service returns
    setTimeout(async function () {
      await deleteLocalFiles([filterPath])
    }, 4000)

    return res    
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req: express.Request, res: express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();