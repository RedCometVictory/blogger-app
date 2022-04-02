// server has error - custom message
export const onError = (err, req, res, next) => {
   res.statusCode =
      err.status && err.status >= 100 && err.status < 600 ? err.status : 500;
   // res.status(500).send(`Sever Error. ${err.message}`);
   // res.json(`Server Error. ${err.message}`);
   res.json({ message: err.message });
}
// if method not exists for route (404)
export const onNoMatch = (req, res, next) => {
  res.status(404).send("Page not found!");
}

export const ncOpts = {
  onError(err, req, res) {
    console.error(err);
    res.statusCode =
      err.status && err.status >= 100 && err.status < 600 ? err.status : 500;
    res.json({ message: err.message });
  },
};

// export const ncOpts = {
//   onError(err, req, res) {
//     console.error(err);
//     res.statusCode =
//       err.status && err.status >= 100 && err.status < 600 ? err.status : 500;
//     res.json({ message: err.message });
//   },
// };