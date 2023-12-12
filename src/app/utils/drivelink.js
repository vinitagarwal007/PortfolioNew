function driveToImage(url) {
  const match = url.match("/file\/d\/([^/]+)/");
  if (match) {
    return "https://drive.google.com/uc?export=view&id="+match[1];
  } else {
    return null;
  }
}
exports.driveToImage = driveToImage;
