
import Messagee from "../../models/message.model.js";
const sendMessage = async (req,res)=>{
    try{
        const { senderId, receiverId, content } = req.body;
        console.log("Received message:", { senderId, receiverId, content });
        // Validate input
        if (!senderId || !receiverId || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Create a new message
        const newMessage = new Messagee({
            sender: senderId,
            receiver: receiverId,
            content: content

        })
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });


    }catch(err){
        console.error('Error sending message:', err);
        res.status(500).json({ error: 'Failed to send message' });
    }
}

export default sendMessage;