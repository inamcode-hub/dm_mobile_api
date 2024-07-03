const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const SERVER_URL = process.env.BEAGLEBONE_SERVER_API_URL;
const getSensorData = async (serialNumber) => {
  try {
    const response = await axios.post(`${SERVER_URL}/devices/read-data`, {
      serialNumber,
    });
    return { success: true, data: response?.data?.data };
  } catch (error) {
    return {
      success: false,
      status:
        error?.response?.data?.error?.message ||
        'Error fetching sensor data from BeagleBone server.',
    };
  }
};

const updateRegister = async (serialNumber, registerAddress, newValue) => {
  if (!serialNumber || !registerAddress || !newValue) {
    return {
      success: false,
      status: 'Invalid input data.',
    };
  }
  serialNumber = parseInt(serialNumber);
  registerAddress = parseInt(registerAddress);
  newValue = parseInt(newValue);
  try {
    const response = await axios.post(`${SERVER_URL}/devices/update-register`, {
      serialNumber,
      registerAddress,
      newValue,
    });
    console.log(response);
    return { success: true, data: response?.data?.data };
  } catch (error) {
    return {
      success: false,
      status:
        error?.response?.data?.error?.message ||
        'Error updating register on BeagleBone server.',
    };
  }
};

module.exports = {
  getSensorData,
  updateRegister,
};
