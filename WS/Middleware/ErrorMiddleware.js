const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  if(process.env.NODE_ENV === 'dev'){
    res.status(statusCode).json({
      message: err.message,
      stack: err.stack,
    })
  } else {
    res.status(statusCode).json({
      message: err.message,
    })
  }
  
}

export { notFound, errorHandler }