const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roles');

const router = express.Router();

// GET - Liste des joueurs (staff uniquement)
router.get('/', authMiddleware, checkRole('coach', 'assistant_coach', 'manager', 'admin'), async (req, res) => {
  try {
    const [players] = await db.execute(`
      SELECT u.id, u.email, u.role, p.pseudo, p.game_role, p.strengths, p.weaknesses, p.progression_areas, p.staff_notes, p.objectives
      FROM users u
      LEFT JOIN player_profiles p ON u.id = p.user_id
      WHERE u.role = 'player'
    `);
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET - Fiche d'un joueur
router.get('/:id', authMiddleware, async (req, res) => {
  const playerId = parseInt(req.params.id);

  // Un joueur ne peut voir que sa propre fiche
  if (req.user.role === 'player' && req.user.id !== playerId) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  try {
    const [players] = await db.execute(`
      SELECT u.id, u.email, u.role, p.pseudo, p.game_role, p.strengths, p.weaknesses, p.progression_areas, p.staff_notes, p.objectives
      FROM users u
      LEFT JOIN player_profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `, [playerId]);

    if (players.length === 0) {
      return res.status(404).json({ error: 'Joueur non trouvé' });
    }

    res.json(players[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT - Modifier une fiche joueur (staff uniquement)
router.put('/:id', authMiddleware, checkRole('coach', 'assistant_coach', 'manager', 'admin'), async (req, res) => {
  const playerId = parseInt(req.params.id);
  const { pseudo, game_role, strengths, weaknesses, progression_areas, staff_notes, objectives } = req.body;

  try {
    await db.execute(`
      UPDATE player_profiles 
      SET pseudo = ?, game_role = ?, strengths = ?, weaknesses = ?, progression_areas = ?, staff_notes = ?, objectives = ?
      WHERE user_id = ?
    `, [pseudo, game_role, strengths, weaknesses, progression_areas, staff_notes, objectives, playerId]);

    res.json({ message: 'Fiche mise à jour' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
