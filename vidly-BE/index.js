const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

const genres = [
  { id: 1, name: "afrobeats" },
  { id: 2, name: "hip/hop" },
  { id: 3, name: "amapiano" },
  { id: 4, name: "highlife" },
];

app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to Vidly App</h1>;
    `);
});

app.get("/api/genres", (req, res) => {
  const options = genres
    .map((item) => `<option value="${item.name}">${item.name}</option>`)
    .join("");

  const html = `
    <div>
    <h1> These are all the genres </h1>
      <select>
        ${options}
      </select>
    </div>
  `;
  res.send(html);
});



app.get('/api/genres/:id',(req, res)=>{
    const genre = genres.find((item)=> item.id === parseInt(req.params.id))
    if (!genre) return res.status(404).send(`Genre with id:${req.params.id} doesnt exit`);
    res.send(genre)
})


app.post("/api/genres", (req, res) => {
  const { error } = validateSchema(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }
  const genre = {
    id: genres.length + 1,
    name: req.body?.name,
  };
  console.log(req.body);
  genres.push(genre);
  res.send(genre);
});


app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find((item) => item.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send(`Genre with id:${req.params.id} doesnt exit`);
  }
  const { error } = validateSchema(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  genre.name = req.body.name;
  console.log(genre);
  res.send(genre);
});


app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find((item) => item.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send(`Genre with id:${req.params.id} doesnt exit`);
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});


function validateSchema(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}


const PORT = process.env.PORT || 5000;


app.listen(5000, () => {
  console.log(`running on port ${PORT}...`);
});
