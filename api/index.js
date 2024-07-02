import express from "express";
import requestIp from "request-ip";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.get("/", async (req, res) => {
  res.send("<h1>Welcome to HNG 11 - Backend Track (Task 1)</h1>");
});

app.get("/api/hello", async (req, res) => {
  try {
    const visitorName = decodeURIComponent(
      req.query.visitor_name.replace(/['"]+/g, "")
    );
    const clientIp = requestIp.getClientIp(req);

    const locationResponse = await axios.get(
      `http://ip-api.com/json/${clientIp}`
    );
    const weatherResponse = await axios.get(
      `https://api.weatherbit.io/v2.0/current?lat=${locationResponse.data.lat}&lon=${locationResponse.data.lon}&key=${process.env.WEATHERBIT_API_KEY}`
    );

    res
      .json({
        client_ip: clientIp,
        location: locationResponse.data.city,
        greeting: `Hello, ${
          visitorName ? visitorName + "!," : ""
        } the temperature is ${
          weatherResponse.data.data[0].app_temp ?? 11
        } degrees Celcius in ${locationResponse.data.city}`,
      })
      .status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ message: "Oops, an error occured wile fetching data" }],
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);

  console.log(PORT);
});
