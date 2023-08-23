const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Hotel = require("../models/hotel");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next();
    return;
  }
  const parsedJWT = jwt.verify(authHeader, process.env.JWT_SECRET);
  req.user = {
    email: parsedJWT.email,
    role: parsedJWT.role,
  };
  next();
};

router.use(verifyToken);



//The Case Sensitivity is required -Too less of a time to Do this,SO Sorry 
router.get("/", async (req, res) => {
  const { limit, page, cityName } = req.query;
  //Pagination & Search
   if(cityName)
   {
    cityname=cityName
  }
  const limitValue = parseInt(limit) || 2;
  const offsetValue = parseInt(page) || 0;
  // const filter
  const hotels = await Hotel.paginate( {
    "$or": [
      { city: { $regex: cityname } }
    ]
  }, { limit: limitValue, page: offsetValue });
  if(hotels)
  {
    res.status(200).send({ message: "Hotel data retrived successfully",hotels });
  }
  else{
    res.status(400).send({ error: "No data Found for the request" });
  }
});


router.get("/:id", async (req, res) => {
  if(req.params.id)
  {
    const hotel = await Hotel.findById(req.params.id);
    res.send(hotel);
  }
  else{
    res.status(400).send({ error: "No data found for this Id,Require a Valid Id" });
  }
 
});

router.post("/", async (req, res) => {
  const hotel = req.body;
  if (hotel) {
    const dbHotel = await Hotel.create(hotel);
    if (dbHotel) {
      res.send({ message: "Hotel created successfully", dbHotel });
    }
    else {
      res.status(400).send({ error: "Error while Storing the data !" });
    }
  }
  else {
    res.status(400).send({ error: "Required Data to create a new entry of a hotel" });
  }
});

router.put("/:id", async (req, res) => {
  if (req.params.id) {
    const hotel = await Hotel.updateOne({ _id: req.params.id }, req.body);
    if (hotel) {
      res.send({ success: true, message: "Hotel updated Successfully" });
    }
    else {
      res.status(400).send({ error: "Error while updating data " });
    }
  }
  else {
    res.status(400).send({ error: "Id is not valid to update the hotel,require a valid id" });
  }
});

router.delete("/:id", async (req, res) => {
  if (req.params.id) {
    const hotel = await Hotel.deleteOne({ _id: req.params.id });
    if (hotel) {
      res.send({ success: true, message: "Hotel Deleted Successfully" });
    }
    else {
      res.status(400).send({ error: "Error while deleting data " });
    }
  }
  else {
    res.status(400).send({ error: "Id is not valid,Require a valid id to delete the entry " });
  }

});

module.exports = router;
