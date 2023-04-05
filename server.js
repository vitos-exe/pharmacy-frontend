const express = require("express");
const path = require("path");

const app = express();

app.use("/script", express.static(path.resolve("script")))
app.use("/styles", express.static(path.resolve("styles")))
app.use("/layout", express.static(path.resolve("layout")))
app.use("/pictures", express.static(path.resolve("pictures")))



app.get("/*", (req, res) => {
    res.sendFile(path.resolve("index.html"));
});

app.listen(process.env.PORT || 8060, () => console.log("Server running..."))