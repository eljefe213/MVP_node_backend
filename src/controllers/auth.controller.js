import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { User } from '../models/index.js';
import { config } from '../config/index.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, skills, availability } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    try {
      const user = await User.create({
        username,
        email,
        password,
        skills,
        availability
      });

      const token = jwt.sign({ id: user.id }, config.jwtSecret);
      res.status(201).json({ 
        token,
        message: 'User registered successfully'
      });
    } catch (validationError) {
      if (validationError.name === 'SequelizeValidationError') {
        return res.status(400).json({
          message: 'Validation error',
          errors: validationError.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id }, config.jwtSecret);
    res.json({ 
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};
