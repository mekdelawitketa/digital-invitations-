// backend/src/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== AUTH MIDDLEWARE ====================
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const isAdmin = async (req, res, next) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  next();
};

const isOwner = async (req, res, next) => {
  if (req.userRole !== 'OWNER' && req.userRole !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden - Owner access required' });
  }
  next();
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        role: 'GUEST',
      },
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Logout
app.post('/api/auth/logout', authenticate, async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// ==================== EVENT ROUTES ====================

// Get all public events
app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        rsvps: true,
        stories: true,
        albums: { include: { images: true } },
        schedules: true,
        weddingParty: true,
        guestbook: { where: { approved: true } },
        songs: { where: { approved: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: events });
  } catch (error) {
    console.error('Fetch events error:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// Get event by slug
app.get('/api/events/:slug', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: req.params.slug },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        rsvps: true,
        stories: true,
        albums: { include: { images: true } },
        schedules: true,
        weddingParty: true,
        guestbook: { where: { approved: true } },
        songs: { where: { approved: true } },
        sections: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ data: event });
  } catch (error) {
    console.error('Fetch event error:', error);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

// Get event by ID (owner/admin)
app.get('/api/events/:id', authenticate, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        rsvps: true,
        stories: true,
        albums: { include: { images: true } },
        schedules: true,
        weddingParty: true,
        guestbook: true,
        songs: true,
        sections: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.ownerId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json({ data: event });
  } catch (error) {
    console.error('Fetch event error:', error);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

// Create event
app.post('/api/events', authenticate, isOwner, async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      startDate,
      timezone,
      venueName,
      venueAddress,
      isPublic,
      themeSettings,
    } = req.body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ message: 'Event with this title already exists' });
    }

    const event = await prisma.event.create({
      data: {
        slug,
        title,
        typeKey: type,
        description,
        startDate: new Date(startDate),
        timezone: timezone || 'UTC',
        venueName,
        venueAddress,
        isPublic: isPublic !== undefined ? isPublic : true,
        themeSettings: themeSettings || {},
        ownerId: req.userId,
        isPublished: false,
      },
    });

    // Create default sections
    const sections = ['hero', 'story', 'gallery', 'videos', 'schedule', 'rsvp', 'guestbook', 'songs', 'location'];
    if (type === 'wedding') {
      sections.push('weddingParty');
    }

    for (const [index, key] of sections.entries()) {
      await prisma.eventSection.create({
        data: {
          eventId: event.id,
          sectionKey: key,
          enabled: true,
          displayOrder: index,
        },
      });
    }

    res.status(201).json({ data: event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// Update event
app.put('/api/events/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      startDate,
      timezone,
      venueName,
      venueAddress,
      isPublic,
      themeSettings,
      coverImage,
      profileImage,
    } = req.body;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.ownerId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    let slug = event.slug;
    if (title && title !== event.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      const existing = await prisma.event.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        return res.status(400).json({ message: 'Event with this title already exists' });
      }
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        timezone,
        venueName,
        venueAddress,
        isPublic,
        themeSettings,
        coverImage,
        profileImage,
      },
    });

    res.json({ data: updated });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// Delete event
app.delete('/api/events/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.ownerId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.event.delete({ where: { id } });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

// ==================== RSVP ROUTES ====================

// Submit RSVP (public)
app.post('/api/events/:id/rsvp', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      status,
      numberOfGuests,
      guestNames,
      message,
      dietaryRequirements,
      specialRequests,
    } = req.body;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (email) {
      const existing = await prisma.rSVP.findFirst({
        where: { eventId: id, email },
      });
      if (existing) {
        return res.status(400).json({ message: 'You have already RSVPd for this event' });
      }
    }

    const rsvp = await prisma.rSVP.create({
      data: {
        eventId: id,
        name,
        email,
        phone,
        status,
        numberOfGuests: numberOfGuests || 1,
        guestNames,
        message,
        dietaryRequirements,
        specialRequests,
      },
    });

    res.status(201).json({ data: rsvp });
  } catch (error) {
    console.error('Submit RSVP error:', error);
    res.status(500).json({ message: 'Failed to submit RSVP' });
  }
});

// Get RSVPs for an event (owner/admin)
app.get('/api/events/:id/rsvps', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.ownerId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const rsvps = await prisma.rSVP.findMany({
      where: { eventId: id },
      orderBy: { rsvpDate: 'desc' },
    });

    res.json({ data: rsvps });
  } catch (error) {
    console.error('Fetch RSVPs error:', error);
    res.status(500).json({ message: 'Failed to fetch RSVPs' });
  }
});

// Get RSVP stats (owner/admin)
app.get('/api/events/:id/rsvps/stats', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.ownerId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const all = await prisma.rSVP.findMany({ where: { eventId: id } });

    const stats = {
      attending: all.filter((r) => r.status === 'attending').length,
      maybe: all.filter((r) => r.status === 'maybe').length,
      notAttending: all.filter((r) => r.status === 'not_attending').length,
      totalRSVPs: all.length,
      totalGuests: all.reduce((sum, r) => sum + r.numberOfGuests, 0),
    };

    res.json({ data: stats });
  } catch (error) {
    console.error('Fetch RSVP stats error:', error);
    res.status(500).json({ message: 'Failed to fetch RSVP stats' });
  }
});

// ==================== GUESTBOOK ROUTES ====================

// Submit guestbook message (public)
app.post('/api/events/:id/guestbook', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, message } = req.body;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const entry = await prisma.guestbookMessage.create({
      data: {
        eventId: id,
        name,
        message,
        approved: false,
      },
    });

    res.status(201).json({ data: entry });
  } catch (error) {
    console.error('Submit guestbook error:', error);
    res.status(500).json({ message: 'Failed to submit message' });
  }
});

// Get guestbook messages
app.get('/api/events/:id/guestbook', async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await prisma.guestbookMessage.findMany({
      where: { eventId: id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: messages });
  } catch (error) {
    console.error('Fetch guestbook error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Approve guestbook message (owner/admin)
app.put('/api/events/:id/guestbook/:messageId/approve', authenticate, async (req, res) => {
  try {
    const { id, messageId } = req.params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.ownerId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const message = await prisma.guestbookMessage.update({
      where: { id: messageId },
      data: { approved: true, rejected: false },
    });

    res.json({ data: message });
  } catch (error) {
    console.error('Approve guestbook error:', error);
    res.status(500).json({ message: 'Failed to approve message' });
  }
});

// Reject guestbook message (owner/admin)
app.put('/api/events/:id/guestbook/:messageId/reject', authenticate, async (req, res) => {
  try {
    const { id, messageId } = req.params;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.ownerId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const message = await prisma.guestbookMessage.update({
      where: { id: messageId },
      data: { approved: false, rejected: true },
    });

    res.json({ data: message });
  } catch (error) {
    console.error('Reject guestbook error:', error);
    res.status(500).json({ message: 'Failed to reject message' });
  }
});

// ==================== SONG ROUTES ====================

// Submit song suggestion (public)
app.post('/api/events/:id/songs', async (req, res) => {
  try {
    const { id } = req.params;
    const { guestName, songTitle, artist, youtubeUrl, spotifyUrl, message } = req.body;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const song = await prisma.songSuggestion.create({
      data: {
        eventId: id,
        guestName,
        songTitle,
        artist,
        youtubeUrl,
        spotifyUrl,
        message,
        approved: false,
      },
    });

    res.status(201).json({ data: song });
  } catch (error) {
    console.error('Submit song error:', error);
    res.status(500).json({ message: 'Failed to submit song' });
  }
});

// Get song suggestions
app.get('/api/events/:id/songs', async (req, res) => {
  try {
    const { id } = req.params;
    const songs = await prisma.songSuggestion.findMany({
      where: { eventId: id },
      orderBy: [{ approved: 'desc' }, { votes: 'desc' }],
    });
    res.json({ data: songs });
  } catch (error) {
    console.error('Fetch songs error:', error);
    res.status(500).json({ message: 'Failed to fetch songs' });
  }
});

// Vote on a song
app.post('/api/songs/:songId/vote', async (req, res) => {
  try {
    const { songId } = req.params;

    const song = await prisma.songSuggestion.update({
      where: { id: songId },
      data: { votes: { increment: 1 } },
    });

    res.json({ data: song });
  } catch (error) {
    console.error('Vote song error:', error);
    res.status(500).json({ message: 'Failed to vote on song' });
  }
});

// ==================== ADMIN ROUTES ====================

// Admin stats
app.get('/api/admin/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      weddingEvents,
      birthdayEvents,
      graduationEvents,
      totalRSVPs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.event.count({ where: { typeKey: 'wedding' } }),
      prisma.event.count({ where: { typeKey: 'birthday' } }),
      prisma.event.count({ where: { typeKey: 'graduation' } }),
      prisma.rSVP.count(),
    ]);

    res.json({
      data: {
        totalUsers,
        totalEvents,
        weddingEvents,
        birthdayEvents,
        graduationEvents,
        totalRSVPs,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Admin users
app.get('/api/admin/users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: users });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Admin update user role
app.put('/api/admin/users/:userId/role', authenticate, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });

    res.json({ data: user });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
});

// Admin delete user
app.delete('/api/admin/users/:userId', authenticate, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});