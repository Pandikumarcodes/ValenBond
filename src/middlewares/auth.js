const adminAuth = (req, res, next) => {
  console.log("Admin Auth getting checked");
  const tokan = "xyz";
  const isAuthorizedToken = tokan === "xyz";
  if (!isAuthorizedToken) {
    res.status(401).send("UnAuthorized request");
  } else {
    next();
  }
};
const userAuth = (req, res, next) => {
  console.log("Admin Auth getting checked");
  const tokan = "xyzddvdv";
  const isAuthorizedToken = tokan === "xyz";
  if (!isAuthorizedToken) {
    res.status(401).send("UnAuthorized request");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
