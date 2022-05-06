const Video = require("../models/Video");
const fs = require("fs");

exports.upload = async (req, res) => {
  let myVideo;
  let uploadPath;
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).send("No files were uploaded.");

    myVideo = req.files.video;
    uploadPath = __dirname + "/../assets/videos/" + myVideo.name;
    //check if the file already exists
    if (fs.existsSync(uploadPath))
      return res.status(400).send("File already exists");
    //check if the file is a video
    if (!myVideo.mimetype.endsWith("mp4"))
      return res.status(400).send("File is not a video");
    //check if the video already exists in the db
    const video = await Video.findOne({ videoName: myVideo.name });
    if (video) return res.status(400).send("Video already exists");

    myVideo.mv(uploadPath, async function (err) {
      if (err) return res.status(500).send(err);
      //create a video object
      await Video.create({
        title: myVideo.name,
        url: uploadPath,
        user: req.body.user._id,
      });
      res.send("File uploaded!");
    });
  } catch (error) {
    return res.status(400).send(error.name);
  }
};

exports.getVideo = async (req, res) => {
  try {
    const videoName = req.body.videoName;
    const video = await Video.findOne({ videoName: req.body.videoName });
    if (!video) return res.status(404).send("Video not found");
    //?possible to check if the user is the owner of the video

    const range = req.headers.range;
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
      })
      .on("end", () => {
        res.end("finished!\n");
      });
  } catch (error) {
    return res.status(400).send(error.name);
  }
  // .pipe(res);
};
