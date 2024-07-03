const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

const getSensorData = async (serialNumber) => {
  console.log('serialNumber', serialNumber);
  try {
    const response = await axios.post(
      'http://localhost:8080/api/devices/read-data',
      {
        serialNumber,
      }
    );
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

module.exports = {
  getSensorData,
};
