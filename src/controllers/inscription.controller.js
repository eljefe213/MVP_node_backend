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
    console.error('Error creating inscription:', error);
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

    if (mission.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view inscriptions' });
    }

    const inscriptions = await Inscription.findAll({
      where: { missionId }
    });
    res.json(inscriptions);
  } catch (error) {
    console.error('Error fetching inscriptions:', error);
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
    console.error('Error fetching user inscriptions:', error);
    res.status(500).json({ message: 'Error fetching inscriptions', error: error.message });
  }
};

export const updateInscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const inscription = await Inscription.findByPk(id, {
      include: [{ model: Mission }]
    });

    if (!inscription) {
      return res.status(404).json({ message: 'Inscription not found' });
    }

    const mission = await Mission.findByPk(inscription.missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    if (mission.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await inscription.update({ status });
    const updatedInscription = await Inscription.findByPk(id, {
      include: [{ model: Mission }]
    });
    res.json(updatedInscription);
  } catch (error) {
    console.error('Error updating inscription:', error);
    res.status(500).json({ message: 'Error updating inscription', error: error.message });
  }
};

export const cancelInscription = async (req, res) => {
  try {
    const { id } = req.params;
    const inscription = await Inscription.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!inscription) {
      return res.status(404).json({ message: 'Inscription not found' });
    }

    await inscription.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error canceling inscription:', error);
    res.status(500).json({ message: 'Error canceling inscription', error: error.message });
  }
};