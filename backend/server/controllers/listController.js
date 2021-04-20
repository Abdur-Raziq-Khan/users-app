const User = require('../models/userModel');
const List = require('../models/listModel');
// const List = require('../models/userModel');

exports.addList = async (req, res, next) => {
    // user = User;
    try {
        const {
            content,
            createdAt,
            // userId
        } = req.body;

        const { userId } = req.params;

        // Get a User
        const user = await User.findById(userId);
        console.log("user: " + user);

        newList = new List({
            content,
            createdAt
        });

        newList.user = user;

        // add list to the user's lists array 'lists'
        user.lists.push(newList);

        await newList.save();
        res.json({
            success: true,
            data: newList,
            message: "List added successfully!"
        });

    } catch(error) {
        next(error);
    }
}

exports.getAllLists = async (req, res, next) => {
    try {
        const lists = await List.find({});
        res.status(200).json({
            success: true,
            data: lists,
            message: "All lists."
        });
    } catch (error) {
        next(error)
    }

}