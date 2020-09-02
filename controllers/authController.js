const _ = require('lodash');

const {User} = require("../models/User");

const registerPage = async (req, res) => {
  const register = req.flash('register');
  res.render('../clients/register', {register});
}

const register = async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  // Input Validation
  if (body.email.trim() === '' || body.password.trim() === ''){
    req.flash('register', "Input cannot be empty");
    return res.redirect('/register');
  }

  // Function to get name from email address
  const name = email => {
    const trimmedEmail = email.trim();
    const name = trimmedEmail.substring(0, trimmedEmail.indexOf("@"));
    return name;
  }

  const user = new User({
    name: name(body.email),
    email: body.email,
    password: body.password
  });

  // Save user information into database
  await user.save().then(async (response) => {
    const authToken = await response.generateAuthToken();
    res.cookie('authToken', authToken);

    req.flash('register', "Your account was created successfully");
    res.redirect('/');
  }, (error) => {
    req.flash('register', "Error encountered while creating your account");
    res.redirect('/register');
  })   
  
}

const loginPage = async (req, res) => {
  const authenticated = req.flash('authenticated');
  res.render('../clients/login', {authenticated});
}

const login = async (req, res) => {
  try{
      const body = _.pick(req.body, ['email', 'password']);
      
      // Input Validation
      if (body.email.trim() === '' || body.password.trim() === ''){
        req.flash('authenticated', "Input cannot be empty");
        return res.redirect('/login');
      }

      // Check if login details correlate
      const user = await User.findByCredentials(body.email, body.password);
      
      // Generate authentication token
      const authToken = await user.generateAuthToken();
      res.cookie('authToken', authToken);

      req.flash('authenticated', "You have been successfully authenticated");
      res.redirect('/');
  }catch(error) {
      req.flash('authenticated', "Oops! Authentication failed, email and password does not correlate");
      res.redirect('/login');
  }
}

const logout = async (req, res) => {
  try{
    const user = req.user;
    
    // Remove authentication token
    await user.removeToken(req.cookies.authToken);
    res.clearCookie('authToken');

    req.flash('authenticated', "You have been logged out successfully.");
    res.redirect('/login');
  } catch (error) {
    req.flash('authenticated', "Oops! Loggging out unsuccessful");
    res.redirect('/login');
  }
}

module.exports = {registerPage, register, loginPage, login, logout}