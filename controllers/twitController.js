const moment = require("moment");

const {Twit} = require("../models/Twit");
const {Comment} = require("../models/Comment");

const loadTwits = async (req, res) => {

  // Get the list of all Twits
  const twits = await Twit.find()
    .populate({
        path: "user",
        select: ('name')
    });

  // Modify the Twits to include comments
  const modifiedTwits = async () => {
    const newTwits = []
    for(let i = 0; i < twits.length; i++) {
      const comments = await Comment.find({twit: twits[i]._id})
        .populate({
            path: "user",
            select: ('name')
        });
        
      newTwits.push({
        ...twits[i]._doc,
        date_posted: moment(twits[i]._doc.date_created).format('YYYY-MM-DD'),
        time_posted: moment(twits[i]._doc.date_created).format('h:mm:ss a'),
        comments
      });
    };
    return newTwits;
  };
  
  const authenticated = req.flash('authenticated');
  const register = req.flash('register');
  const twitCreated = req.flash('twitCreated');
  const twitDeleted = req.flash('twitDeleted');
  const likeTwit = req.flash('likeTwit');
  const commentPosted = req.flash('commentPosted');
  res.render('../clients/twits', {twits: await modifiedTwits(), authenticated, register, twitDeleted, twitCreated, commentPosted, likeTwit});
};

const createTwit = async (req, res) => {
  try {
    // Input Validation
    if (req.body.twit.trim() === ''){
      req.flash('twitCreated', "Twits cannot be empty");
      return res.redirect('/');
    };

    const twit = new Twit({
      user: req.user._id,
      twit: req.body.twit
    });

    await twit.save().then((response) => {
      req.flash('twitCreated', "Hurray!, your twit has been successfully created");
      res.redirect('/');
    }, (error) => {
      throw new Error();
    });
  } catch (error) {
    req.flash('twitCreated', "Error encountered why creating your Twit. Please try again.");
    res.redirect('/');
  }
};

const deleteTwit = async (req, res) => {
  try {
    const twit = await Twit.findById(req.body.twitId);
    
    // Check if user owns the twit
    if (String(req.user._id) !== String(twit.user)) {
      throw new Error();
    }
    
    // Delete the comment associated with the twits and the Twit itself
    await Comment.deleteMany({twit: req.body.twitId})
    .then(async (response) => {
      await Twit.findByIdAndRemove(req.body.twitId, {useFindAndModify: false})
        .then(response => {
          req.flash('twitDeleted', "Twit deleted successfully");
          res.redirect('/');
        }, (error) => {
            throw new Error();
          }
        );
    }, (error) => {
        throw new Error();
      }
    );
    
  } catch (error) {
    req.flash('twitDeleted', "Problem encounter while deleting Twit.");
    res.redirect('/');
  }

};

const postComment = async (req, res) => {
  try {
    // Input Validation
    if (req.body.comment.trim() === ''){
      req.flash('commentPosted', "Comment cannot be empty");
      return 
      res.redirect('/');
    }
    const comment = new Comment({
      user: req.user._id,
      twit: req.body.twitId,
      comment: req.body.comment
    })

    await comment.save().then((response) => {
      req.flash('commentPosted', "Comment added successfully");
      res.redirect('/');
    }, (error) => {
      throw new Error();
    });
  } catch (error) {
    req.flash('commentPosted', "Error encountered why adding your comment. Please try again");
    res.redirect('/');
  }
};

const likeTwit = async (req, res) => {
  try {
    const twit = await Twit.findById(req.body.twitId);

    //Check if the user has liked the twit already
    const twitLiked = twit.likes.filter((like) => String(like) === String(req.user._id));
    if(twitLiked.length > 0) {
        req.flash('likeTwit', "You have liked the tweet already.");
        return res.redirect('/');
    }

    // Update the twit with new information
    await Twit.findByIdAndUpdate(
      req.body.twitId,
      {$push: {likes: [req.user._id]}},
      {useFindAndModify: false}
    ).then((response) => {
      req.flash('likeTwit', "Twit liked successfully");
      res.redirect('/');
    }, (error) => {
      throw new Error();
    });
  } catch (error) {
    req.flash('likeTwit', "Error encountered why liking tweet. Please try again");
    res.redirect('/');
  }
};

module.exports = {loadTwits, createTwit, postComment, deleteTwit, likeTwit}