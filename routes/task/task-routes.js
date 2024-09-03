const express=require('express')
const Task=require('../../models/task');
const User=require('../../models/user')
const isLoggedIn = require('../../utils/isLoggedIn');
const handleAsyncErr = require('../../utils/catchError');
const router=express.Router();





//create task
router.post('/create', isLoggedIn, handleAsyncErr(async (req, res) => {
    try {
        const { task } = req.body
        const newTask = new Task({
            author: req.user._id,
            task: task
        })
        await newTask.save()
        res.json({ message: 'Task added successfully' })

    } catch (error) {
        console.log('error occured while adding task', error)

    }
}));


//show all tasks by user
router.get('/:username/list', isLoggedIn, handleAsyncErr(async (req, res) => {
    try {
        const { username } = req.params
        const foundUser = await User.findOne({ Username: username })
        const userTasks = await Task.find({ author: foundUser._id })

        return res.json({ userTasks })

    } catch (error) {
        console.log('error occured while adding task', error)

    }
}));


//get task by id
router.get('/:id', handleAsyncErr(async (req, res) => {
    const { id } = req.params
    const foundTask = await Task.findById(id)
    res.json({ message: 'Task has been found', foundTask })
}))


//edit
router.put('/:id/update', isLoggedIn, handleAsyncErr(async (req, res) => {
    try {
        const { id } = req.params
        const { task } = req.body
        const userTask = await Task.findById(id)

        // conso(userTask.author === req.user._id)
        if (userTask.author.equals(req.user._id)) {
            const updatedTask = await Task.findByIdAndUpdate({ _id: id }, { task: task })
            return (
                res.json({ message: 'Task updated successfully', updatedTask })
            )
        } else {
            res.json({ message: 'unauthorized' })
        }

    } catch (error) {
        console.log(error)
    }

}));


// delete user tak
router.delete('/:id/delete', isLoggedIn, handleAsyncErr(async (req, res) => {
    try {
        const { id } = req.params
        const userTask = await Task.findById(id)
        if (userTask.author.equals(req.user._id)) {
            await Task.findByIdAndDelete({ _id: id })
            res.json({ message: 'Task has been deleted' })
        } else {
            res.json({ message: 'unauthorized' })
        }

    } catch (error) {
        console.log(error)
    }

}));
module.exports=router