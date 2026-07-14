import express from "express";
import Thread from "../models/Thread.js";
import getopenaiResponse from "../utils/openai.js";
import auth from "../middleware/auth.js";

const router = express.Router();
 
//test
router.post("/test", auth, async (req, res) => { 
    try {
        const thread = new Thread({
            userId: req.user.id,
            threadId: "xyzz",
            title : "testing new Thread",
        });

        const response = await thread.save();
        res.json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "failed to save in db" });
    }
});

//get all threads
router.get("/thread", auth, async (req, res) => {
    try {
        const threads = await Thread.find({
            userId: req.user.id
        }).sort({ updatedAt: -1 });

        res.json(threads);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "failed to fetch threads" });
    }
});


router.get("/thread/:threadId", auth, async (req, res) => {

    const { threadId } = req.params;

    try {

        const thread = await Thread.findOne({
            threadId,
            userId: req.user.id
        });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);

    } catch (error) {

        console.log(error);
        res.status(500).json({ error: "failed to fetch chat id" });

    }

});


router.delete("/thread/:threadId", auth, async (req, res) => {

    const { threadId } = req.params;

    try {

        const deletedthread = await Thread.findOneAndDelete({
            threadId,
            userId: req.user.id
        });

        if (!deletedthread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json({
            success: "Thread deleted successfully"
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({ error: "failed to delete chat id" });

    }

});

// chat section

router.post("/chat", auth, async (req, res) => {

    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({
            error: "threadId and message are required"
        });
    }

    try {

        let thread = await Thread.findOne({
            threadId,
            userId: req.user.id
        });

        if (!thread) {

            thread = new Thread({
                userId: req.user.id,
                threadId,
                title: message,
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            });

        } else {

            thread.messages.push({
                role: "user",
                content: message
            });

        }

        const assistantResponse = await getopenaiResponse(message);

        thread.messages.push({
            role: "assistant",
            content: assistantResponse
        });

        await thread.save();

        res.json({
            assistantResponse
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            error: "failed to process chat"
        });

    }

});

export default router;