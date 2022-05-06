const path = require("path");
const VideoStream = require("../utils/data");

exports.upload = async (req, res) => {
  let sampleFile;
  let uploadPath;
  console.log(req.files);
  if (!req.files || Object.keys(req.files).length === 0)
    return res.status(400).send("No files were uploaded.");

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded files
  sampleFile = req.files.video;
  uploadPath = __dirname + "/../assets/videos/" + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    res.send("File uploaded!");
  });
};

exports.getVideo = async (req, res) => {
  let fs = require("fs");
  //todo add a db query to get the video
  //   const video = await Video.findById(req.params.id);
  //   if (!video) return res.status(404).send("Video not found");
  //   res.send(video);
  //   res.sendFile("assets/videos/Nature_Beautiful.mp4", { root: __dirname });

  const range = req.headers.range;
  const videoName = req.body.videoName;
  let videoPath = `${__dirname}/../assets/videos/`;
  if (videoName) videoPath += `${videoName}.mp4`;
  //default video
  else videoPath += `video.mp4`;
  //in case if range was not provided
  if (!range) {
    res.writeHead(200, {
      "Content-Type": "video/mp4",
      "Content-Length": fs.statSync(`${videoPath}`).size,
    });
    fs.createReadStream(`${videoPath}`).pipe(res);
    return;
  }

  const videoSize = fs.statSync(videoPath).size;

  // Parse Range
  const parts = range.replace(/bytes=/, "").split("-");

  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
  const chunksize = end - start + 1;
  //   const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  //   const start = Number(range.replace(/\D/g, ""));

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream
    .on("data", (chunk) => {
      const result = res.write(chunk);
      //   console.log(result);
      //   if (result) videoStream.pause();
    })
    .on("end", () => {
      res.end("finished!\n");
    });
  // .pipe(res);
};
