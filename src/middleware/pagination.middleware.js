export const paginate = (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    req.pagination = {
      offset: (page - 1) * limit,
      limit,
    };
    
    next();
  };