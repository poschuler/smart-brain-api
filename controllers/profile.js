const handleProfile = (db) => (req, res) => {
  const { id } = req.params;

  db.select('*')
    .from('users')
    .where({
      id: id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        return res.status(400).json('not found');
      }
    })
    .catch((err) => {
      return res.status(400).json('not found');
    });
};

module.exports = {
  handleProfile: handleProfile,
};
