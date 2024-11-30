import { Inscription, Mission } from '../models/index.js';

export const createInscription = async (req, res) => {
  try {
    const { missionId } = req.params;
    const { hours } = req.body;

    if (!hours) {
      return res.status(400).json({ message: 'Hours are required' });
    }

    const mission = await Mission.findByPk(missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    if (mission.status !== 'published') {
      return res.status(400).json({ message: 'Mission is not available for inscription' });
    }

    const existingInscription = await Inscription.findOne({
      where: {
        userId: req.user.id,
        missionId
      }
    });

    if (existingInscription) {
      return res.status(400).json({ message: 'Already inscribed to this mission' });
    }

    const inscription = await Inscription.create({
      userId: req.user.id,
      missionId,
      hours,
      status: 'pending'
    });

    res.status(201).json(inscription);
  } catch (error) {
    res.status(500).json({ message: 'Error creating inscription', error: error.message });
  }
};

export const getMissionInscriptions = async (req, res) => {
  try {
    const { missionId } = req.params;
    
    const mission = await Mission.findByPk(missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    const inscriptions = await Inscription.findAll({
      where: { missionId }
    });
    res.json(inscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inscriptions', error: error.message });
  }
};

export const getUserInscriptions = async (req, res) => {
  try {
    const inscriptions = await Inscription.findAll({
      where: { userId: req.user.id },
      include: [{ model: Mission }]
    });
    res.json(inscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inscriptions', error: error.message });
  }
};

export const updateInscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inscription = await Inscription.findByPk(id);
    if (!inscription) {
      return res.status(404).json({ message: 'Inscription not found' });
    }

    const mission = await Mission.findByPk(inscription.missionId);
    if (mission.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await inscription.update({ status });
    res.json(inscription);
  } catch (error) {
    res.status(500).json({ message: 'Error updating inscription', error: error.message });
  }
};

export const cancelInscription = async (req, res) => {
  try {
    const inscription = await Inscription.findByPk(req.params.id);
    if (!inscription) {
      return res.status(404).json({ message: 'Inscription not found' });
    }

    if (inscription.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await inscription.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error canceling inscription', error: error.message });
  }
};