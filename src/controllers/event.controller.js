import { validationResult } from 'express-validator';
import { Event, Mission } from '../models/index.js';

export const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { missionId } = req.params;
    const { title, description, start_date, end_date } = req.body;

    const mission = await Mission.findByPk(missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    if (mission.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to create events for this mission' });
    }

    const event = await Event.create({
      title,
      description,
      start_date,
      end_date,
      missionId
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

export const getMissionEvents = async (req, res) => {
  try {
    const { missionId } = req.params;
    
    const events = await Event.findAll({
      where: { missionId },
      order: [['start_date', 'ASC']]
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_date, end_date } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const mission = await Mission.findByPk(event.missionId);
    if (mission.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.update({
      title,
      description,
      start_date,
      end_date
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const mission = await Mission.findByPk(event.missionId);
    if (mission.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};