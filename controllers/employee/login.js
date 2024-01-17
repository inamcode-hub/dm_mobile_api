const { StatusCodes } = require('http-status-codes');
const Employee = require('../../models/Employee');

// Create operation
const login = async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password is provided
  if (!email || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Please provide email and password' });
  //  check if password is at least 8 characters
  if (password.length < 8)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Password must be at least 8 characters',
    });
  try {
    const employee = await Employee.findOne({ email });
    // check if employee exists
    if (!employee) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'Invalid credentials' });
    }
    const isPasswordCorrect = await employee.comparePassword(password);
    //  check if password is correct
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'Invalid credentials' });
    }
    if (employee.active === false) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'You are not authorized!' });
    }
    //  create token and send to client
    const token = await employee.createJWT();
    const { role, firstName, lastName, dmSerial, subscriptionExpiry } =
      employee;
    res.status(StatusCodes.OK).json({
      success: true,
      role,
      firstName,
      lastName,
      token,
      email,
      dmSerial,
      subscriptionExpiry,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.login = login;
