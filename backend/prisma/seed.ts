import { PrismaClient, EventTypeKey, RSVPStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Event Types
  console.log('🌱 Creating event types...');
  
  await prisma.eventType.upsert({
    where: { key: 'wedding' },
    update: {},
    create: {
      key: 'wedding',
      name: 'Wedding',
      description: 'Romantic wedding celebrations',
      config: { weddingParty: true, guestbook: true, songs: true, gallery: true, schedule: true, rsvp: true }
    }
  });

  await prisma.eventType.upsert({
    where: { key: 'birthday' },
    update: {},
    create: {
      key: 'birthday',
      name: 'Birthday',
      description: 'Fun birthday parties',
      config: { weddingParty: false, guestbook: true, songs: true, gallery: true, schedule: true, rsvp: true }
    }
  });

  await prisma.eventType.upsert({
    where: { key: 'graduation' },
    update: {},
    create: {
      key: 'graduation',
      name: 'Graduation',
      description: 'Inspirational graduation ceremonies',
      config: { weddingParty: false, guestbook: true, songs: true, gallery: true, schedule: true, rsvp: true }
    }
  });

  console.log('✅ Event types created');

  // 2. Create Admin & Owner
  console.log('👤 Creating users...');
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  const ownerPassword = await bcrypt.hash('owner123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      name: 'Platform Admin',
      role: 'ADMIN'
    }
  });

  const abraham = await prisma.user.upsert({
    where: { email: 'abraham@example.com' },
    update: {},
    create: {
      email: 'abraham@example.com',
      passwordHash: ownerPassword,
      name: 'Abraham',
      role: 'OWNER'
    }
  });

  console.log('✅ Users created');

  // 3. Wedding Event
  console.log('💒 Creating Wedding Event...');
  
  const wedding = await prisma.event.upsert({
    where: { slug: 'abraham-sara-wedding' },
    update: {},
    create: {
      slug: 'abraham-sara-wedding',
      title: 'Abraham & Sara Wedding',
      description: 'Join us as we celebrate our love and union.',
      typeKey: 'wedding',
      ownerId: abraham.id,
      startDate: new Date('2026-09-15T16:00:00Z'),
      timezone: 'Africa/Addis_Ababa',
      venueName: 'Millennium Wedding Hall',
      venueAddress: 'Bole Road, Addis Ababa, Ethiopia',
      contactPhone: '+251911223344',
      contactEmail: 'abraham.sara@wedding.com',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
      profileImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400',
      isPublic: true,
      isPublished: true,
      themeSettings: { primaryColor: '#D4AF37', secondaryColor: '#F5F5DC', font: 'Playfair Display' }
    }
  });

  // Enable sections for wedding
  const weddingSections = ['hero', 'story', 'gallery', 'weddingParty', 'videos', 'schedule', 'rsvp', 'guestbook', 'songs', 'location'];
  for (const [idx, key] of weddingSections.entries()) {
    await prisma.eventSection.upsert({
      where: { eventId_sectionKey: { eventId: wedding.id, sectionKey: key } },
      update: {},
      create: { eventId: wedding.id, sectionKey: key, enabled: true, displayOrder: idx }
    });
  }

  // Wedding story
  await prisma.eventStory.create({
    data: {
      eventId: wedding.id,
      title: 'How We Met',
      subtitle: 'A beautiful beginning',
      content: 'Abraham and Sara met at a mutual friend\'s gathering in 2020. Their love story blossomed over coffee dates and long walks, leading to a beautiful proposal in the gardens of Addis Ababa.',
      displayOrder: 1
    }
  });

  // Wedding Party
  const weddingPartyMembers = [
    { name: 'Sara', role: 'Bride' },
    { name: 'Abraham', role: 'Groom' },
    { name: 'Meron', role: 'Maid of Honor' },
    { name: 'Dawit', role: 'Best Man' },
    { name: 'Helen', role: 'Bridesmaid' },
    { name: 'Yonas', role: 'Groomsman' }
  ];
  for (const [idx, member] of weddingPartyMembers.entries()) {
    await prisma.weddingPartyMember.create({
      data: {
        eventId: wedding.id,
        name: member.name,
        role: member.role,
        profileImage: `https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&background=random`,
        bio: `${member.role} of the wedding`,
        displayOrder: idx
      }
    });
  }

  // Wedding Schedule
  await prisma.scheduleItem.create({
    data: {
      eventId: wedding.id,
      title: 'Wedding Ceremony',
      description: 'The union of Abraham and Sara',
      date: new Date('2026-09-15'),
      startTime: '16:00',
      endTime: '17:00',
      location: 'Millennium Wedding Hall',
      displayOrder: 1
    }
  });

  await prisma.scheduleItem.create({
    data: {
      eventId: wedding.id,
      title: 'Dinner Reception',
      description: 'Celebratory dinner with family and friends',
      date: new Date('2026-09-15'),
      startTime: '18:00',
      endTime: '20:00',
      location: 'Millennium Wedding Hall',
      displayOrder: 2
    }
  });

  // Sample RSVP
  await prisma.rSVP.create({
    data: {
      eventId: wedding.id,
      name: 'John Doe',
      email: 'john@example.com',
      status: RSVPStatus.attending,
      numberOfGuests: 2,
      message: 'So excited for you both! 🎉'
    }
  });

  console.log('✅ Wedding event created');

  // 4. Birthday Event
  console.log('🎂 Creating Birthday Event...');
  
  const tsita = await prisma.event.upsert({
    where: { slug: 'tsita-birthday' },
    update: {},
    create: {
      slug: 'tsita-birthday',
      title: "Tsita's Birthday Bash",
      description: 'Turning 25 in style!',
      typeKey: 'birthday',
      ownerId: abraham.id,
      startDate: new Date('2026-08-20T19:00:00Z'),
      timezone: 'Africa/Addis_Ababa',
      venueName: 'Sky Lounge',
      venueAddress: 'Bole, Addis Ababa',
      coverImage: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1200',
      isPublic: true,
      isPublished: true,
      themeSettings: { primaryColor: '#FF6B6B', secondaryColor: '#FFE66D', font: 'Nunito' }
    }
  });

  const birthdaySections = ['hero', 'story', 'gallery', 'videos', 'schedule', 'rsvp', 'guestbook', 'songs', 'location'];
  for (const [idx, key] of birthdaySections.entries()) {
    await prisma.eventSection.upsert({
      where: { eventId_sectionKey: { eventId: tsita.id, sectionKey: key } },
      update: {},
      create: { eventId: tsita.id, sectionKey: key, enabled: true, displayOrder: idx }
    });
  }

  await prisma.eventStory.create({
    data: {
      eventId: tsita.id,
      title: 'My Journey',
      content: '25 years of laughter, love, and learning. Join me as I celebrate this milestone with the people I love most!',
      displayOrder: 1
    }
  });

  // Birthday Schedule
  await prisma.scheduleItem.create({
    data: {
      eventId: tsita.id,
      title: 'Guest Arrival',
      date: new Date('2026-08-20'),
      startTime: '19:00',
      endTime: '19:30',
      location: 'Sky Lounge',
      displayOrder: 1
    }
  });

  await prisma.scheduleItem.create({
    data: {
      eventId: tsita.id,
      title: 'Cake Cutting',
      date: new Date('2026-08-20'),
      startTime: '20:00',
      endTime: '20:30',
      location: 'Sky Lounge',
      displayOrder: 2
    }
  });

  console.log('✅ Birthday event created');

  // 5. Graduation Event
  console.log('🎓 Creating Graduation Event...');
  
  const amran = await prisma.event.upsert({
    where: { slug: 'amran-getente-graduation' },
    update: {},
    create: {
      slug: 'amran-getente-graduation',
      title: "Amran Getente's Graduation",
      description: 'Celebrating Academic Excellence',
      typeKey: 'graduation',
      ownerId: abraham.id,
      startDate: new Date('2026-07-10T10:00:00Z'),
      timezone: 'Africa/Addis_Ababa',
      venueName: 'Addis Ababa University',
      venueAddress: 'Sidist Kilo, Addis Ababa',
      coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=1200',
      isPublic: true,
      isPublished: true,
      themeSettings: { primaryColor: '#2C3E50', secondaryColor: '#F1C40F', font: 'Lora' }
    }
  });

  const graduationSections = ['hero', 'story', 'gallery', 'videos', 'schedule', 'rsvp', 'guestbook', 'songs', 'location'];
  for (const [idx, key] of graduationSections.entries()) {
    await prisma.eventSection.upsert({
      where: { eventId_sectionKey: { eventId: amran.id, sectionKey: key } },
      update: {},
      create: { eventId: amran.id, sectionKey: key, enabled: true, displayOrder: idx }
    });
  }

  await prisma.eventStory.create({
    data: {
      eventId: amran.id,
      title: 'My Academic Journey',
      content: 'From freshman to graduate. This is the story of my journey through university, the challenges, the friendships, and the triumph of earning my degree.',
      displayOrder: 1
    }
  });

  // Graduation Schedule
  await prisma.scheduleItem.create({
    data: {
      eventId: amran.id,
      title: 'Graduation Ceremony',
      date: new Date('2026-07-10'),
      startTime: '10:00',
      endTime: '12:00',
      location: 'Addis Ababa University',
      displayOrder: 1
    }
  });

  await prisma.scheduleItem.create({
    data: {
      eventId: amran.id,
      title: 'Celebration Dinner',
      date: new Date('2026-07-10'),
      startTime: '18:00',
      endTime: '21:00',
      location: 'Addis Ababa University',
      displayOrder: 2
    }
  });

  console.log('✅ Graduation event created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('📋 Events created:');
  console.log(`   💒 ${wedding.slug} (Wedding)`);
  console.log(`   🎂 ${tsita.slug} (Birthday)`);
  console.log(`   🎓 ${amran.slug} (Graduation)`);
  console.log('\n🔑 Login credentials:');
  console.log(`   Admin: admin@example.com / admin123`);
  console.log(`   Owner: abraham@example.com / owner123`);
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });