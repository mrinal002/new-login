const asyncHandler = (requestHandler) => {
    return (req, res, next) =>{
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err) )
    }
};









export { asyncHandler }

// const asyncHandler = () => {};
// const asyncHandler = (fn) => {() => {}}; 
// const asyncHandler = (fn) => () => {};
// const asyncHandler = (fn) => async () => {}; 