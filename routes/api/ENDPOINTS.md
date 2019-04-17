GET /  list of saved videos

GET /:id sends a saved video to client

POST /:youtubeVideoID/:itag save a video to server -> returns a size when downloading starts

GET /info/:youtubeVideoID 
/api/info/qTNKcIBIamA

DELETE /:id deletes id from saved

GET /downloading list and status of downloading

DELETE /downloading/:id cancel and delete downloading video

