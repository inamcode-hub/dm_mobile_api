const { StatusCodes } = require('http-status-codes');
const Employee = require('../../models/Employee');

const registerEmployeeAsAdmin = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please fill all required fields',
    });
  }

  try {
    const { userId } = req.user;
    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      password,
      role: 'employee',
      createdBy: userId,
    });
    employee.password = undefined;

    return res.status(StatusCodes.CREATED).json({
      success: true,
      firstName,
      lastName,
      message: 'Employee created successfully',
      result: employee,
      role: employee.role,
    });
  } catch (err) {
    next(err);
  }
};

exports.registerEmployeeAsAdmin = registerEmployeeAsAdmin;
