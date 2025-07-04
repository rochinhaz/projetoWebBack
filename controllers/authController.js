const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.getRegister = (req, res) => {
  res.render('register');
};

exports.postRegister = async (req, res) => {
  const { username, password } = req.body;
  await User.create({ username, password });
  res.redirect('/login');
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    return res.send('Login inválido');
  }

  req.session.userId = user._id;
  res.redirect('/home');
};

exports.getHome = (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  res.render('home', { username: req.session.userId });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};
