GET /  list of saved videos

GET /:id sends a saved video to client

POST / save a video to server -> returns a metadata when downloading starts
with body { "url":"https://youtube.com/?watch=asdasdkjalskdjalsk", "itag":18}
GET /info/:youtubeVideoID 
/api/info/qTNKcIBIamA

DELETE /:id deletes id from saved

GET /notify/:id returns either with error or when it's downloaded

GET /downloading list and status of downloading

DELETE /downloading/:id cancel and delete downloading video



