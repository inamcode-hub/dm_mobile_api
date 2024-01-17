const { StatusCodes } = require('http-status-codes');
const Seller = require('../../models/Seller');

// only employee admin can register a seller

const registerSellerAsAdmin = async (req, res, next) => {
  const { name, role } = req.body;
  if (!name || !role) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please provide name and role',
    });
  }
  const createdBy = req.user.userId;

  try {
    const seller = await Seller.create({ name, role, createdBy });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: `Seller ${seller.name} created successfully`,
      data: seller,
    });
  } catch (err) {
    next(err);
  }
};

exports.registerSellerAsAdmin = registerSellerAsAdmin;
