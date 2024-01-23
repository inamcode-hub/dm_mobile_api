const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const profileUpdate = async (req, res, next) => {
  const {
    firstName,
    lastName,
    farmName,
    cellPhone,
    email,
    // Address fields
    formattedAddress,
    apartment,
    building,
    street,
    city,
    state,
    country,
    zipCode,
    // Geolocation fields
    longitude,
    latitude,
  } = req.body;

  try {
    const addressUpdate = {
      'address.formattedAddress': formattedAddress,
      'address.apartment': apartment,
      'address.building': building,
      'address.street': street,
      'address.city': city,
      'address.state': state,
      'address.country': country,
      'address.zipCode': zipCode,
      'address.location': {
        type: 'Point',
        coordinates: [longitude, latitude], // Ensure longitude comes first
      },
    };

    const updateUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        firstName: firstName,
        lastName: lastName,
        farmName: farmName,
        cellPhone: cellPhone,
        email: email,
        ...addressUpdate, // Spread the address fields here
      },
      {
        new: true,
        runValidators: true,
      }
    ).select(
      '-password -recoveryToken -__v -_id -dryermasterId -email -role -createdAt -updatedAt'
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User profile updated',
      data: updateUser,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  profileUpdate,
};
