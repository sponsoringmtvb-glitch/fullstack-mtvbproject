import type { Player, NewsArticle, Match, GalleryPhoto, Sponsor, CategoryRule, Team, HomePageContent, StaffMember, ClubInfo, GeneralSettings, AdminActivity, Product, Order, Classement } from '../types';
import { SponsorTier } from '../types';
import { getCategoryByYear } from '../services/utils';

const createDobFromYear = (year: number) => new Date(`${year}-01-01`).toISOString();

export const initialCategoryRules: CategoryRule[] = [
    { name: 'U16 Garçons', startYear: 2010, endYear: 2011 },
    { name: 'U16 Filles', startYear: 2010, endYear: 2011 },
    { name: 'U18 Garçons', startYear: 2008, endYear: 2009 },
    { name: 'U18 Filles', startYear: 2008, endYear: 2009 },
    { name: 'U20', startYear: 2005, endYear: 2007 },
    { name: 'Senior', startYear: 1900, endYear: 2004 }, // Use a wide range for seniors
    { name: 'Dames', startYear: 1900, endYear: 2004 },
];


export const initialTeams: Team[] = [
  { id: 1, name: "AS FAR", category: "Dames", logo: 'https://via.placeholder.com/150x150/0000FF/FFFFFF?text=FAR', photoUrl: 'https://picsum.photos/seed/team1/800/600' },
  { id: 2, name: "OCS", category: "Dames", logo: 'https://via.placeholder.com/150x150/FF0000/FFFFFF?text=OCS', photoUrl: 'https://picsum.photos/seed/team2/800/600' },
  { id: 3, name: "Noor Marrakech", category: "U20", logo: 'https://via.placeholder.com/150x150/008000/FFFFFF?text=NM', photoUrl: 'https://picsum.photos/seed/team3/800/600' },
  { id: 4, name: "Raja Casablanca", category: "U20", logo: 'https://via.placeholder.com/150x150/228B22/FFFFFF?text=RCA', photoUrl: 'https://picsum.photos/seed/team4/800/600' },
  { id: 5, name: "Wydad Casablanca", category: "U18 Garçons", logo: 'https://via.placeholder.com/150x150/DC143C/FFFFFF?text=WAC', photoUrl: 'https://picsum.photos/seed/team5/800/600' },
  { id: 6, name: "Atlas Lions VC", category: "Senior", logo: 'https://via.placeholder.com/150x150/FFA500/FFFFFF?text=ALVC', photoUrl: 'https://picsum.photos/seed/team6/800/600' },
  { id: 7, name: "Agadir Volley", category: "Senior", logo: 'https://via.placeholder.com/150x150/4682B4/FFFFFF?text=AV', photoUrl: 'https://picsum.photos/seed/team7/800/600' },
  { id: 8, name: "Safi Seagulls", category: "Senior", logo: 'https://via.placeholder.com/150x150/00CED1/FFFFFF?text=SS', photoUrl: 'https://picsum.photos/seed/team8/800/600' },
  { id: 9, name: "Tiznit Titans", category: "U16 Garçons", logo: 'https://via.placeholder.com/150x150/9400D3/FFFFFF?text=TT', photoUrl: 'https://picsum.photos/seed/team9/800/600' },
  { id: 10, name: "Marrakech Stars", category: "U16 Garçons", logo: 'https://via.placeholder.com/150x150/FF1493/FFFFFF?text=MS', photoUrl: 'https://picsum.photos/seed/team10/800/600' },
  { id: 11, name: "Essaouira Eagles", category: "U18 Garçons", logo: 'https://via.placeholder.com/150x150/4B0082/FFFFFF?text=EE', photoUrl: 'https://picsum.photos/seed/team11/800/600' },
  { id: 12, name: "Filles d'Agadir", category: "U18 Filles", logo: 'https://via.placeholder.com/150x150/FF69B4/FFFFFF?text=FA', photoUrl: 'https://picsum.photos/seed/team12/800/600' },
  { id: 13, name: "Perles de Tiznit", category: "U18 Filles", logo: 'https://via.placeholder.com/150x150/1E90FF/FFFFFF?text=PT', photoUrl: 'https://picsum.photos/seed/team13/800/600' },
  { id: 14, name: "Jeunes Talents", category: "U16 Filles", logo: 'https://via.placeholder.com/150x150/ADFF2F/000000?text=JT', photoUrl: 'https://picsum.photos/seed/team14/800/600' },
];

export const initialHomePageContent: HomePageContent = {
  title: 'MOULOUDIA TIZNIT',
  subtitle: 'Pride of Tiznit Volleyball',
  ctaTeam: 'Meet the Team',
  ctaSchedule: 'View Schedule',
  heroImageUrl: 'https://picsum.photos/seed/hero/1200/400',
};

export const initialGeneralSettings: GeneralSettings = {
  clubName: "Mouloudia Tiznit",
  logoUrl: "/vite.svg",
  faviconUrl: "/vite.svg",
  isMaintenanceMode: false,
  socialLinks: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
  },
  enabledStandingsCategories: ['Dames', 'U18 Garçons', 'U18 Filles', 'U16 Garçons', 'U16 Filles'],
  smtpSettings: {
    host: 'smtp.example.com',
    port: 587,
    secure: true,
    user: 'user@example.com',
    pass: 'password'
  }
};

export const initialClubInfo: ClubInfo = {
    history: "Founded with passion, Mouloudia Tiznit Volleyball Club has been a cornerstone of the local sports community for decades. From humble beginnings to becoming a competitive force, our journey is one of dedication, teamwork, and a relentless pursuit of excellence.",
    mission: "Our mission is to promote the sport of volleyball in the Tiznit region, foster young talent through our development programs, and compete at the highest level with integrity and sportsmanship. We strive to be a source of pride for our city and an inspiration for the next generation of athletes."
};

export const initialStaffMembers: StaffMember[] = [
    { id: 1, name: "Rachid Benali", position: "Head Coach", bio: "With over 20 years of coaching experience, Rachid brings a wealth of tactical knowledge and a passion for player development to the team.", imageUrl: "https://picsum.photos/seed/s1/400/400" },
    { id: 2, name: "Fatima Zahra", position: "Assistant Coach", bio: "A former national team player, Fatima specializes in defensive strategy and works closely with our liberos and blockers.", imageUrl: "https://picsum.photos/seed/s2/400/400" },
    { id: 3, name: "Hassan Alami", position: "Club President", bio: "Hassan is a lifelong supporter of Tiznit sports and provides the strategic leadership to guide the club's growth and success.", imageUrl: "https://picsum.photos/seed/s3/400/400" },
    { id: 4, name: "Amina El Fassi", position: "Physiotherapist", bio: "Amina is dedicated to keeping our players in peak physical condition, managing injury prevention and rehabilitation programs.", imageUrl: "https://picsum.photos/seed/s4/400/400" },
];


export const initialPlayers: Player[] = [
  { 
    id: 1, name: 'Karim Ait Hamou', sex: 'Male', position: 'Setter', number: 10, imageUrl: 'https://picsum.photos/seed/p1/400/500', height: '188cm', bio: 'Team captain and strategic leader on the court. Known for precise sets and calm under pressure.', stats: { matchesPlayed: 85, points: 210, blocks: 45, aces: 95 },
    email: 'karim.ait@example.com', dob: createDobFromYear(2003), phone: '555-0101', status: 'assigned', team: 'Senior', documents: { idCard: 'id_card.pdf', parentalAuth: null, medicalCert: 'medical.pdf'}, notifications: [], category: getCategoryByYear(createDobFromYear(2003), initialCategoryRules), isVerified: true
  },
  { 
    id: 2, name: 'Yasmine El-Ghazi', sex: 'Female', position: 'Outside Hitter', number: 7, imageUrl: 'https://picsum.photos/seed/p2/400/500', height: '195cm', bio: 'A powerful spiker with an explosive jump. Consistently our top scorer.', stats: { matchesPlayed: 92, points: 1250, blocks: 88, aces: 120 },
    email: 'yasmine.elghazi@example.com', dob: createDobFromYear(2004), phone: '555-0102', status: 'assigned', team: 'Dames', documents: { idCard: 'id_card.pdf', parentalAuth: null, medicalCert: 'medical.pdf'}, notifications: [], category: getCategoryByYear(createDobFromYear(2004), initialCategoryRules), isVerified: true
  },
  { 
    id: 3, name: 'Amine Boussouf', sex: 'Male', position: 'Middle Blocker', number: 12, imageUrl: 'https://picsum.photos/seed/p3/400/500', height: '202cm', bio: 'The defensive wall of the team. Leads the league in blocks per set.', stats: { matchesPlayed: 90, points: 620, blocks: 350, aces: 30 },
    email: 'amine.boussouf@example.com', dob: createDobFromYear(2002), phone: '555-0103', status: 'assigned', team: 'Senior', documents: { idCard: 'id_card.pdf', parentalAuth: null, medicalCert: 'medical.pdf'}, notifications: [], category: getCategoryByYear(createDobFromYear(2002), initialCategoryRules), isVerified: true
  },
  { 
    id: 4, name: 'Mahdia Ziyech', sex: 'Female', position: 'Libero', number: 1, imageUrl: 'https://picsum.photos/seed/p4/400/500', height: '180cm', bio: 'Incredibly agile and quick. His saves often turn the tide of the game.', stats: { matchesPlayed: 95, points: 5, blocks: 2, aces: 0 },
    email: 'mahdia.ziyech@example.com', dob: createDobFromYear(2005), phone: '555-0104', status: 'assigned', team: 'U20', documents: { idCard: 'id_card.pdf', parentalAuth: 'auth.pdf', medicalCert: 'medical.pdf'}, notifications: [], category: getCategoryByYear(createDobFromYear(2005), initialCategoryRules), isVerified: true
  },
  { 
    id: 5, name: 'Bilal Benkassou', sex: 'Male', position: 'Opposite Hitter', number: 5, imageUrl: 'https://picsum.photos/seed/p5/400/500', height: '198cm', bio: 'A left-handed powerhouse, providing a strong offensive presence from the right side.', stats: { matchesPlayed: 88, points: 980, blocks: 150, aces: 85 },
    email: 'bilal.benkassou@example.com', dob: createDobFromYear(2008), phone: '555-0106', status: 'assigned', team: 'U18 Garçons', documents: { idCard: 'id_card.pdf', parentalAuth: 'auth.pdf', medicalCert: 'medical.pdf'}, notifications: [], category: getCategoryByYear(createDobFromYear(2008), initialCategoryRules), isVerified: true
  },
  { 
    id: 6, name: 'Samira Laghrissi', sex: 'Female', position: 'Outside Hitter', number: 9, imageUrl: 'https://picsum.photos/seed/p6/400/500', height: '193cm', bio: 'A versatile player, strong in both attack and defense. Great all-around skills.', stats: { matchesPlayed: 75, points: 730, blocks: 70, aces: 65 },
    email: 'samira.laghrissi@example.com', dob: createDobFromYear(2009), phone: '555-0107', status: 'assigned', team: 'U18 Filles', documents: { idCard: 'id_card.pdf', parentalAuth: 'auth.pdf', medicalCert: 'medical.pdf'}, notifications: [], category: getCategoryByYear(createDobFromYear(2009), initialCategoryRules), isVerified: true
  },
];

export const initialNews: NewsArticle[] = [
  { 
    id: 1, 
    title: 'Mouloudia Tiznit Secures Victory in Season Opener', 
    date: '2024-09-15T10:00:00Z', 
    summary: 'The team started the season with a decisive 3-0 win against rivals Atlas Lions VC, showcasing a powerful offensive strategy.', 
    imageUrl: 'https://picsum.photos/seed/n1/600/400',
    content: 'In a thrilling start to the new season, Mouloudia Tiznit demonstrated their championship ambitions with a commanding 3-0 victory over long-time rivals Atlas Lions VC. The home crowd at Tiznit Arena was electric, witnessing a display of power, precision, and teamwork.\n\nFrom the first serve, Tiznit dominated the net, with Middle Blocker Amine Boussouf putting on a defensive masterclass. The offensive firepower came from Youssef El-Ghazi, who was unstoppable on the outside. Coach Benali expressed his satisfaction after the match, stating, "This is the result of months of hard work. The team executed the game plan perfectly. It\'s a great start, but we know the journey is long. We stay focused for the next challenge."' 
  },
  { 
    id: 2, 
    title: 'Captain Karim Ait Hamou on Team\'s Ambitions', 
    date: '2024-09-10T14:30:00Z', 
    summary: 'In a recent interview, Captain Karim Ait Hamou discussed the team\'s goals for the season, emphasizing teamwork and a drive for the championship.', 
    imageUrl: 'https://picsum.photos/seed/n2/600/400',
    content: 'Team captain Karim Ait Hamou sat down with local sports journalists to outline the squad\'s ambitions for the upcoming season. "We are not just here to compete; we are here to win," he stated with confidence. "The spirit in the locker room is incredible. We have a mix of experienced veterans and exciting young talent, and everyone is pushing each other to be better every single day."\n\nAit Hamou highlighted the importance of fan support, calling the Tiznit crowd their "seventh player on the court." He urged fans to pack the arena for every home game, promising a season of exciting, high-energy volleyball.'
  },
  { 
    id: 3, 
    title: 'New Youth Training Program Announced', 
    date: '2024-09-05T09:00:00Z', 
    summary: 'Mouloudia Tiznit is proud to launch a new program to develop young volleyball talent in the Tiznit region.', 
    imageUrl: 'https://picsum.photos/seed/n3/600/400',
    content: 'As part of its commitment to the community, Mouloudia Tiznit has officially launched its new Youth Training Program. The initiative aims to identify and nurture the next generation of volleyball stars in Tiznit and the surrounding Souss-Massa region. The program will offer weekly training sessions, expert coaching from the club\'s staff, and mentorship from senior team players. "Investing in our youth is investing in the future of our club and our city," said the club president. "We are excited to provide young athletes with the resources and guidance they need to reach their full potential."'
  },
  { 
    id: 4, 
    title: 'Team Unveils New Kits for the 2024-2025 Season', 
    date: '2024-08-28T12:00:00Z', 
    summary: 'The new green and white jerseys were revealed today, featuring a modern design that honors the club\'s heritage.', 
    imageUrl: 'https://picsum.photos/seed/n4/600/400',
    content: 'Mouloudia Tiznit officially unveiled their new home and away kits for the 2024-2025 season at a special event for club members and press. The new designs, created in partnership with a local sportswear brand, feature a modern take on the classic green and white colors. The home jersey incorporates a subtle geometric pattern inspired by local Tizniti art, while the away jersey is a clean white with bold green accents. Players and fans alike have praised the new look, which perfectly blends tradition with modern style.'
  },
];

const today = new Date();
const getFutureDate = (days: number) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
const getPastDate = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const initialMatches: Match[] = [
  { id: 1, opponent: 'Atlas Lions VC', category: 'Senior', date: getPastDate(14), location: 'Tiznit Arena', isHome: true, result: { ourScore: 3, opponentScore: 0 }, playerOfTheMatchId: 2 },
  { id: 2, opponent: 'Agadir Volley', category: 'Senior', date: getPastDate(7), location: 'Agadir Sports Hall', isHome: false, result: { ourScore: 3, opponentScore: 2 }, playerOfTheMatchId: 3 },
  { 
    id: 3, 
    opponent: 'Noor Marrakech', 
    category: 'U20', 
    date: getFutureDate(7), 
    location: 'Tiznit Arena', 
    isHome: true, 
    liveStreamUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    liveScore: {
      ourSets: 2,
      opponentSets: 1,
      ourPoints: 18,
      opponentPoints: 21,
      currentSet: 4,
      servingTeam: 'opponent'
    }
  },
  { id: 4, opponent: 'AS FAR', category: 'Dames', date: getFutureDate(14), location: 'AS FAR Hall', isHome: false },
  { id: 5, opponent: 'Raja Casablanca', category: 'U20', date: getFutureDate(21), location: 'Tiznit Arena', isHome: true },
  { id: 6, opponent: 'Wydad Casablanca', category: 'U18 Garçons', date: getFutureDate(28), location: 'Mohammed V Complex', isHome: false },
  { id: 7, opponent: 'Tiznit Titans', category: 'U16 Garçons', date: getFutureDate(10), location: 'Tiznit Arena', isHome: true },
  { id: 8, opponent: 'Marrakech Stars', category: 'U16 Garçons', date: getFutureDate(18), location: 'Marrakech Hall', isHome: false },
  { id: 9, opponent: 'Filles d\'Agadir', category: 'U18 Filles', date: getFutureDate(12), location: 'Agadir Hall', isHome: false },
  { id: 10, opponent: 'Perles de Tiznit', category: 'U18 Filles', date: getFutureDate(20), location: 'Tiznit Arena', isHome: true },
];

export const initialGallery: GalleryPhoto[] = [
    {id: 1, imageUrl: 'https://picsum.photos/seed/g1/600/400', caption: 'Intense moment at the net.'},
    {id: 2, imageUrl: 'https://picsum.photos/seed/g2/600/400', caption: 'Celebrating a crucial point.'},
    {id: 3, imageUrl: 'https://picsum.photos/seed/g3/600/400', caption: 'Team huddle before the match.'},
    {id: 4, imageUrl: 'https://picsum.photos/seed/g4/600/400', caption: 'A powerful spike from the outside.'},
    {id: 5, imageUrl: 'https://picsum.photos/seed/g5/600/400', caption: 'Defensive dive to keep the rally alive.'},
    {id: 6, imageUrl: 'https://picsum.photos/seed/g6/600/400', caption: 'Fans cheering for the team.'},
    {id: 7, imageUrl: 'https://picsum.photos/seed/g7/600/400', caption: 'Post-game victory celebration.'},
    {id: 8, imageUrl: 'https://picsum.photos/seed/g8/600/400', caption: 'Coach giving strategic advice.'},
];

export const initialSponsors: Sponsor[] = [
    { id: 1, name: 'Tiznit Telecom', imageUrl: 'https://via.placeholder.com/150x60/15803d/ffffff?text=Tiznit+Telecom', websiteUrl: '#', tier: SponsorTier.Platinum },
    { id: 2, name: 'Banque Populaire Tiznit', imageUrl: 'https://via.placeholder.com/150x60/15803d/ffffff?text=Banque+Populaire', websiteUrl: '#', tier: SponsorTier.Platinum },
    { id: 3, name: 'Souss-Massa Region', imageUrl: 'https://via.placeholder.com/150x60/86efac/14532d?text=Souss-Massa', websiteUrl: '#', tier: SponsorTier.Gold },
    { id: 4, name: 'SilverArgan Co.', imageUrl: 'https://via.placeholder.com/150x60/86efac/14532d?text=SilverArgan', websiteUrl: '#', tier: SponsorTier.Gold },
    { id: 5, name: 'Café des Sports', imageUrl: 'https://via.placeholder.com/150x60/f0fdf4/14532d?text=Café+des+Sports', websiteUrl: '#', tier: SponsorTier.Silver },
    { id: 6, name: 'Tiznit Print', imageUrl: 'https://via.placeholder.com/150x60/f0fdf4/14532d?text=Tiznit+Print', websiteUrl: '#', tier: SponsorTier.Silver },
];

export const initialAdminActivity: AdminActivity[] = [
    { id: 1, timestamp: new Date().toISOString(), message: "New player 'Ali Hassan' registered." },
    { id: 2, timestamp: getPastDate(1), message: "Match vs 'Agadir Volley' was added to the schedule." },
    { id: 3, timestamp: getPastDate(2), message: "Registration for 'Fatima Zohra' was approved." },
];

export const initialProducts: Product[] = [
    { 
        id: 1, 
        name: 'Home Jersey 2024/25', 
        description: 'Official team home jersey for the new season. Lightweight and breathable fabric.', 
        price: 450, 
        images: ['https://picsum.photos/seed/jersey1/500/500', 'https://picsum.photos/seed/jersey1b/500/500', 'https://picsum.photos/seed/jersey1c/500/500'], 
        category: 'Jerseys',
        stock: 50,
        variants: [
            { name: 'Size', type: 'button', options: [{ value: 'S', label: 'S' }, { value: 'M', label: 'M' }, { value: 'L', label: 'L' }, { value: 'XL', label: 'XL' }] },
            { name: 'Color', type: 'color', options: [{ value: '#16a34a', label: 'Green' }, { value: '#f8fafc', label: 'White' }] }
        ]
    },
    { 
        id: 2, 
        name: 'Away Jersey 2024/25', 
        description: 'Official team away jersey. Clean white design with green accents.', 
        price: 450, 
        images: ['https://picsum.photos/seed/jersey2/500/500', 'https://picsum.photos/seed/jersey2b/500/500'], 
        category: 'Jerseys',
        stock: 30,
        variants: [
            { name: 'Size', type: 'button', options: [{ value: 'S', label: 'S' }, { value: 'M', label: 'M' }, { value: 'L', label: 'L' }, { value: 'XL', label: 'XL' }] },
            { name: 'Color', type: 'color', options: [{ value: '#FFFFFF', label: 'White' }, { value: '#15803d', label: 'Dark Green' }] }
        ]
    },
    { 
        id: 3, 
        name: 'Club Scarf', 
        description: 'Classic supporter scarf in club colors. Keep warm and show your support.', 
        price: 150, 
        images: ['https://picsum.photos/seed/scarf/500/500'], 
        category: 'Accessories',
        stock: 100,
        variants: [
            { name: 'Style', type: 'button', options: [{ value: 'Classic', label: 'Classic' }] }
        ]
    },
    { 
        id: 4, 
        name: 'Official Volleyball', 
        description: 'High-quality match ball with the club logo. Perfect for training or a match with friends.', 
        price: 300, 
        images: ['https://picsum.photos/seed/ball/500/500'], 
        category: 'Equipment',
        stock: 0,
        variants: [
             { name: 'Size', type: 'button', options: [{ value: 'Size 5', label: 'Size 5' }] }
        ]
    },
    { 
        id: 5, 
        name: 'Supporter Cap', 
        description: 'A stylish cap with an embroidered club crest. Adjustable fit.', 
        price: 120, 
        images: ['https://picsum.photos/seed/cap/500/500'], 
        category: 'Accessories',
        stock: 75,
        variants: [
            { name: 'Fit', type: 'button', options: [{ value: 'Adjustable', label: 'Adjustable' }] },
            { name: 'Color', type: 'color', options: [{ value: '#0f172a', label: 'Black' }, { value: '#16a34a', label: 'Green' }] }
        ]
    },
    { 
        id: 6, 
        name: 'Training Hoodie', 
        description: 'Comfortable hoodie for training sessions or casual wear. Features a fleece lining.', 
        price: 550, 
        images: ['https://picsum.photos/seed/hoodie/500/500'], 
        category: 'Apparel',
        stock: 25,
        variants: [
             { name: 'Size', type: 'button', options: [{ value: 'M', label: 'M' }, { value: 'L', label: 'L' }, { value: 'XL', label: 'XL' }, { value: 'XXL', label: 'XXL' }] }
        ]
    },
];

export const initialOrders: Order[] = [
    {
        id: 1,
        customer: { name: 'Ahmed Hassan', email: 'ahmed@example.com', phone: '555-1234', address: '123 Main St', city: 'Tiznit', postalCode: '85000' },
        items: [
            { productId: 1, name: 'Home Jersey 2024/25', price: 450, quantity: 1, selectedVariants: { Size: 'L', Color: '#16a34a' } },
            { productId: 3, name: 'Club Scarf', price: 150, quantity: 2, selectedVariants: { Style: 'Classic' } },
        ],
        total: 750,
        status: 'Pending',
        date: getPastDate(2),
    },
    {
        id: 2,
        customer: { name: 'Fatima Alami', email: 'fatima@example.com', phone: '555-5678', address: '456 Palm Ave', city: 'Agadir', postalCode: '80000' },
        items: [
            { productId: 4, name: 'Official Volleyball', price: 300, quantity: 1, selectedVariants: { Size: 'Size 5' } },
        ],
        total: 300,
        status: 'Shipped',
        date: getPastDate(5),
    }
];

export const initialStandings: Classement = {
    'Dames': [
        { id: 1, teamName: 'AS FAR', points: 12, played: 4, wins: 4, losses: 0 },
        { id: 2, teamName: 'Mouloudia Tiznit', points: 9, played: 4, wins: 3, losses: 1 },
        { id: 3, teamName: 'OCS', points: 8, played: 4, wins: 3, losses: 1 },
        { id: 4, teamName: 'Club X', points: 3, played: 4, wins: 1, losses: 3 },
        { id: 5, teamName: 'Club Y', points: 0, played: 4, wins: 0, losses: 4 },
    ],
    'U18 Garçons': [
        { id: 6, teamName: 'Wydad Casablanca', points: 10, played: 4, wins: 3, losses: 1 },
        { id: 7, teamName: 'Mouloudia Tiznit', points: 9, played: 4, wins: 3, losses: 1 },
        { id: 8, teamName: 'Essaouira Eagles', points: 8, played: 4, wins: 3, losses: 1 },
        { id: 9, teamName: 'Team B', points: 2, played: 4, wins: 1, losses: 3 },
    ],
    'U18 Filles': [
        { id: 15, teamName: 'Perles de Tiznit', points: 12, played: 4, wins: 4, losses: 0 },
        { id: 16, teamName: 'Filles d\'Agadir', points: 9, played: 4, wins: 3, losses: 1 },
    ],
    'U16 Garçons': [
        { id: 10, teamName: 'Tiznit Titans', points: 15, played: 5, wins: 5, losses: 0 },
        { id: 11, teamName: 'Mouloudia Tiznit', points: 12, played: 5, wins: 4, losses: 1 },
        { id: 12, teamName: 'Marrakech Stars', points: 9, played: 5, wins: 3, losses: 2 },
    ],
    'U16 Filles': [
         { id: 13, teamName: 'Jeunes Talents', points: 6, played: 2, wins: 2, losses: 0 },
         { id: 14, teamName: 'Mouloudia Tiznit', points: 3, played: 2, wins: 1, losses: 1 },
    ]
};