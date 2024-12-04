import { validationResult } from 'express-validator';
import { Mission } from '../models/index.js';

export const createMission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mission = await Mission.create({
      ...req.body,
      userId: req.user.id,
      status: 'draft'
    });

    res.status(201).json(mission);
  } catch (error) {
    console.error('Error creating mission:', error);
    res.status(500).json({ message: 'Error creating mission', error: error.message });
  }
};

export const getAllMissions = async (req, res) => {
  try {
    const missions = await Mission.findAll();
    res.json(missions);
  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({ message: 'Error fetching missions', error: error.message });
  }
};

export const getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findByPk(req.params.id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }
    res.json(mission);
  } catch (error) {
    console.error('Error fetching mission:', error);
    res.status(500).json({ message: 'Error fetching mission', error: error.message });
  }
};

export const updateMissionStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const mission = await Mission.findByPk(id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    if (mission.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await mission.update({ status });
    res.json(mission);
  } catch (error) {
    console.error('Error updating mission:', error);
    res.status(500).json({ message: 'Error updating mission', error: error.message });
  }
};

export const deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findByPk(req.params.id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    if (mission.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await mission.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting mission:', error);
    res.status(500).json({ message: 'Error deleting mission', error: error.message });
  }
};