let express = require("express");
let app = express();
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");
let path = require("path");
let dbp = path.join(__dirname, "moviesData.db");
app.use(express.json());
let db = null;
const nai = async () => {
  try {
    db = await open({
      filename: dbp,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running");
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
nai();
app.get("/movies/", async (request, response) => {
  const query = `select movie_name from movie`;
  const data = await db.all(query);
  response.send(data);
});
app.post("/movies/", async (request, response) => {
  const body = request.body;
  const { directorId, movieName, leadActor } = body;
  const query = `insert into movie(director_id,movie_name,
        lead_actor) values('${directorId}','${movieName}','${leadActor}');`;
  const data = await db.run(query);
  response.send("Movie Successfully Added");
});
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `select * from movie  where movie_id='${movieId}';`;
  let data = await db.get(query);
  response.send(data);
});
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const body = request.body;
  const { directorId, movieName, leadActor } = body;
  const query = `update movie set 
       director_id='${directorId}',
       movie_name='${movieName}',
       lead_actor='${leadActor}'
      where movie_id='${movieId}';`;
  const data = await db.run(query);
  response.send("Movie Details Updated");
});
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const query = `delete from movie where movie_id='${movieId}'`;
  const data = await db.run(query);
  response.send("Movie Removed");
});
app.get("/directors/", async (request, response) => {
  const query = `select * from director`;
  const data = await db.all(query);
  response.send(data);
});
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const query = `select movie_name from movie where director_id='${directorId}'`;
  const data = await db.all(query);
  response.send(data);
});
module.exports = app;
