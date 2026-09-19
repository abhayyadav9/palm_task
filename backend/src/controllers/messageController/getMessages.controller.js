import Messagee from '../../models/message.model.js';

const  getMessages = async (req, res) => {
    try{
        const { senderId, receiverId } = req.query;
        // Validate input
        if (!senderId || !receiverId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Fetch messages between the sender and receiver
        const messages = await Messagee.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 })

        res.status(200).json({ data: messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}
export default getMessages;