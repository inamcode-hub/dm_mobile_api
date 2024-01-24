const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jose = require('jose');

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      maxlength: 20,
      minlength: 3,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      maxlength: 20,
      minlength: 3,
      lowercase: true,
      trim: true,
    },
    cellPhone: {
      type: String,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 50,
      minlength: 8,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['employee', 'admin'],
      default: 'employee',
      lowercase: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      lowercase: true,
      trim: true,
    },
    dob: {
      type: Date,
      trim: true,
    },
    active: { type: Boolean, default: true },
    verified: {
      type: Boolean,
      default: false,
    },
    recoveryToken: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'Employee',
    },
  },
  { timestamps: true }
);

employeeSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//  JWT token creation
employeeSchema.methods.createJWT = async function () {
  const alg = 'HS256';

  return await new jose.SignJWT({ userId: this._id, name: this.firstName })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(this.role)
    .setAudience(`urn:example:audience`)
    .setExpirationTime(process.env.JWT_EXPIRES_IN)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET_EMPLOYEE));
};

//  compare password with hashed password

employeeSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
//  password reset token

employeeSchema.methods.createPasswordResetToken = async function () {
  const alg = 'HS256';
  const resetToken = await new jose.SignJWT({
    userId: this._id,
    name: this.firstName,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(this.role)
    .setAudience(`urn:example:audience`)
    .setExpirationTime('10m')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET_EMPLOYEE));
  return resetToken;
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
