const { StatusCodes } = require('http-status-codes');
const Employee = require('../../models/Employee');

// Create operation
const registerAdmin = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please fill all required fields',
    });
    return;
  }
  try {
    const totalEmployee = await Employee.countDocuments();
    if (totalEmployee >= 1) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'You are unauthorized to create employee',
      });
      return;
    }

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      password,
      role: 'admin',
    });
    const token = await employee.createJWT();
    res.status(StatusCodes.CREATED).json({
      success: true,
      firstName,
      lastName,
      message: 'Employee created successfully',
      result: employee,
      role: employee.role,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.registerAdmin = registerAdmin;
