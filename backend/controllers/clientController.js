import Client from "../models/Client.js";

export const getClients = async (req, res) => {
    try {
        const clients = await Client.find({ agencyId: req.user.agencyId });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createClient = async (req, res) => {
    try {
        if (!req.user.agencyId) {
            return res.status(400).json({
                message: "User account is not associated with any agency. Please contact support or re-register as an Owner."
            });
        }

        const newClient = await Client.create({
            ...req.body,
            agencyId: req.user.agencyId
        });
        res.status(201).json(newClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateClient = async (req, res) => {
    try {
        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, agencyId: req.user.agencyId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!client) return res.status(404).json({ message: "Client not found" });
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({
            _id: req.params.id,
            agencyId: req.user.agencyId
        });
        if (!client) return res.status(404).json({ message: "Client not found" });
        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
