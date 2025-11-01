import React, { createContext, useState, useMemo, useCallback } from 'react';
import type { Player, NewsArticle, Match, Sponsor, PlayerStatus, PlayerDocuments, CategoryRule, Team, HomePageContent, ClubInfo, StaffMember, GeneralSettings, AdminActivity, Product, Order, OrderStatus, Classement, StandingItem, LiveScore } from '../types';
import { useToasts } from '../hooks/useToasts';
import { useTranslation } from '../hooks/useTranslation';
import { getCategoryByYear, stringToHash } from '../services/utils';
import { initialPlayers, initialNews, initialMatches, initialSponsors, initialCategoryRules, initialTeams, initialHomePageContent, initialClubInfo, initialStaffMembers, initialGeneralSettings, initialAdminActivity, initialProducts, initialOrders } from '../data/mockData';

interface IDataContext {
    registeredPlayers: Player[];
    registerPlayer: (playerData: Pick<Player, 'name' | 'email' | 'dob' | 'phone' | 'sex'> & { password?: string }) => boolean;
    findOrCreatePlayerByGoogle: (googleUser: { email: string; name: string }) => Player;
    verifyPlayerEmail: (playerId: number) => void;
    updatePlayerStatus: (playerId: number, status: PlayerStatus) => void;
    verifyPlayerDocuments: (playerId: number, isApproved: boolean) => void;
    assignPlayerTeam: (playerId: number, team: string | null) => void;
    addPlayerDocuments: (playerId: number, documents: PlayerDocuments) => void;
    updatePlayer: (player: Player) => void;
    updatePlayerContactInfo: (playerId: number, data: { name: string; email: string; phone: string; }) => void;
    addPlayer: (playerData: Omit<Player, 'id'>) => void;
    deletePlayer: (playerId: number) => void;

    news: NewsArticle[];
    addNewsArticle: (articleData: Omit<NewsArticle, 'id'>) => void;
    updateNewsArticle: (article: NewsArticle) => void;
    deleteNewsArticle: (id: number) => void;
    matches: Match[];
    addMatch: (matchData: Omit<Match, 'id'>) => void;
    updateMatch: (match: Match) => void;
    deleteMatch: (id: number) => void;
    sponsors: Sponsor[];
    addSponsor: (sponsorData: Omit<Sponsor, 'id'>) => void;
    updateSponsor: (sponsor: Sponsor) => void;
    deleteSponsor: (id: number) => void;

    categoryRules: CategoryRule[];
    addCategoryRule: (rule: CategoryRule) => void;
    updateCategoryRules: (rules: CategoryRule[]) => void;
    deleteCategoryRule: (categoryName: string) => void;

    teams: Team[];
    addTeam: (teamData: Omit<Team, 'id'>) => void;
    updateTeam: (team: Team) => void;
    deleteTeam: (id: number) => void;
    
    homePageContent: HomePageContent;
    updateHomePageContent: (content: HomePageContent) => void;

    clubInfo: ClubInfo;
    updateClubInfo: (info: ClubInfo) => void;
    staffMembers: StaffMember[];
    addStaffMember: (memberData: Omit<StaffMember, 'id'>) => void;
    updateStaffMember: (member: StaffMember) => void;
    deleteStaffMember: (id: number) => void;

    generalSettings: GeneralSettings;
    updateGeneralSettings: (settings: GeneralSettings) => void;

    adminActivity: AdminActivity[];
    
    products: Product[];
    addProduct: (productData: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: number) => void;

    orders: Order[];
    addOrder: (orderData: Omit<Order, 'id'>) => number;
    updateOrderStatus: (orderId: number, status: OrderStatus) => void;
    
    standings: Classement;
    trackedStandingCategories: string[];
    addTrackedCategory: (category: string) => void;
    removeTrackedCategory: (category: string) => void;

    liveMatchId: number | null;
    setLiveMatchId: (id: number | null) => void;
    updateLiveScore: (matchId: number, score: LiveScore) => void;

    loading: boolean;
    fetchError: string | null;
}

export const DataContext = createContext<IDataContext>({} as IDataContext);

export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [registeredPlayers, setRegisteredPlayers] = useState<Player[]>(initialPlayers);
    const [news, setNews] = useState<NewsArticle[]>(initialNews);
    const [matches, setMatches] = useState<Match[]>(initialMatches);
    const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);
    const [categoryRules, setCategoryRules] = useState<CategoryRule[]>(initialCategoryRules);
    const [teams, setTeams] = useState<Team[]>(initialTeams);
    const [homePageContent, setHomePageContent] = useState<HomePageContent>(initialHomePageContent);
    const [clubInfo, setClubInfo] = useState<ClubInfo>(initialClubInfo);
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaffMembers);
    const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(initialGeneralSettings);
    const [adminActivity, setAdminActivity] = useState<AdminActivity[]>(initialAdminActivity);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [trackedStandingCategories, setTrackedStandingCategories] = useState<string[]>(initialGeneralSettings.enabledStandingsCategories);
    const [liveMatchId, setLiveMatchId] = useState<number | null>(null);

    const { addToast } = useToasts();
    const { t } = useTranslation();
    
    const standings = useMemo((): Classement => {
        if (!generalSettings || !trackedStandingCategories) return {};
        const calculatedStandings: Classement = {};
    
        trackedStandingCategories.forEach(category => {
            const categoryMatches = matches.filter(m => m.category === category && m.result);
            const teamsInStandings: { [teamName: string]: StandingItem } = {};
    
            const ensureTeam = (teamName: string) => {
                if (!teamsInStandings[teamName]) {
                    teamsInStandings[teamName] = {
                        id: stringToHash(teamName), teamName, points: 0, played: 0, wins: 0, losses: 0,
                    };
                }
            };
    
            categoryMatches.forEach(match => {
                const clubTeamName = generalSettings.clubName;
                const opponentTeamName = match.opponent;
                
                ensureTeam(clubTeamName);
                ensureTeam(opponentTeamName);
    
                const ourScore = match.result!.ourScore;
                const opponentScore = match.result!.opponentScore;
    
                teamsInStandings[clubTeamName].played += 1;
                teamsInStandings[opponentTeamName].played += 1;
    
                let winner: 'club' | 'opponent';
                let winScore: number;
                let lossScore: number;

                if (ourScore > opponentScore) {
                    winner = 'club'; winScore = ourScore; lossScore = opponentScore;
                    teamsInStandings[clubTeamName].wins += 1;
                    teamsInStandings[opponentTeamName].losses += 1;
                } else {
                    winner = 'opponent'; winScore = opponentScore; lossScore = ourScore;
                    teamsInStandings[opponentTeamName].wins += 1;
                    teamsInStandings[clubTeamName].losses += 1;
                }
    
                if (winScore === 3 && (lossScore === 0 || lossScore === 1)) {
                    teamsInStandings[winner === 'club' ? clubTeamName : opponentTeamName].points += 3;
                } else if (winScore === 3 && lossScore === 2) {
                    teamsInStandings[winner === 'club' ? clubTeamName : opponentTeamName].points += 2;
                    teamsInStandings[winner === 'club' ? opponentTeamName : clubTeamName].points += 1;
                }
            });
    
            calculatedStandings[category] = Object.values(teamsInStandings).sort((a,b) => b.points - a.points);
        });
    
        return calculatedStandings;
    }, [matches, trackedStandingCategories, generalSettings]);
    
    const logAdminActivity = useCallback((message: string) => {
        const newActivity: AdminActivity = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            message,
        };
        setAdminActivity(prev => [newActivity, ...prev]);
    }, []);

    const registerPlayer = (playerData: Pick<Player, 'name' | 'email' | 'dob' | 'phone' | 'sex'> & { password?: string }) => {
        if (registeredPlayers.some(p => p.email === playerData.email)) {
            addToast(t('toast_error_email_exists'), 'error');
            return false;
        }
        const newPlayer: Player = {
            id: Date.now(),
            name: playerData.name,
            email: playerData.email,
            sex: playerData.sex,
            dob: playerData.dob,
            phone: playerData.phone,
            status: 'pending',
            category: getCategoryByYear(playerData.dob, categoryRules),
            team: null,
            documents: { idCard: null, parentalAuth: null, medicalCert: null },
            notifications: ["Welcome! Your registration is under review. Please verify your email address."],
            isVerified: false,
            authProvider: 'email',
            position: 'Outside Hitter',
            number: 0,
            imageUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${playerData.name}`,
            height: '',
            bio: '',
            stats: { matchesPlayed: 0, points: 0, blocks: 0, aces: 0 }
        };

        setRegisteredPlayers(prev => [...prev, newPlayer]);
        logAdminActivity(`New player '${newPlayer.name}' registered and is pending approval.`);
        addToast(t('toast_success_registration_pending'), 'success');
        return true;
    };
    
    const findOrCreatePlayerByGoogle = (googleUser: { email: string; name: string }): Player => {
        const existingPlayer = registeredPlayers.find(p => p.email === googleUser.email);
        if (existingPlayer) return existingPlayer;

        const newPlayer: Player = {
            id: Date.now(),
            name: googleUser.name,
            email: googleUser.email,
            sex: 'Male',
            dob: new Date().toISOString(),
            phone: '',
            status: 'approved',
            category: getCategoryByYear(new Date().toISOString(), categoryRules),
            team: null,
            documents: { idCard: null, parentalAuth: null, medicalCert: null },
            notifications: ["Welcome! Your account was created with Google. Please upload your documents to continue."],
            isVerified: true,
            authProvider: 'google',
            position: 'Outside Hitter',
            number: 0,
            imageUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${googleUser.name}`,
            height: '',
            bio: '',
            stats: { matchesPlayed: 0, points: 0, blocks: 0, aces: 0 }
        };
        setRegisteredPlayers(prev => [...prev, newPlayer]);
        logAdminActivity(`New player '${newPlayer.name}' registered via Google.`);
        addToast(`Welcome, ${newPlayer.name}!`, 'success');
        return newPlayer;
    };
    
    const updateRecord = <T extends {id: number}>(setter: React.Dispatch<React.SetStateAction<T[]>>, updatedRecord: T) => {
        setter(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    };
    
    const deleteRecord = <T extends {id: number}>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: number) => {
        setter(prev => prev.filter(r => r.id !== id));
    };
    
    const addRecord = <T extends {id: number}>(setter: React.Dispatch<React.SetStateAction<T[]>>, newRecord: Omit<T, 'id'>) => {
        const recordWithId = { ...newRecord, id: Date.now() } as T;
        setter(prev => [...prev, recordWithId]);
        return recordWithId;
    };
    
    const verifyPlayerEmail = (playerId: number) => { const player = registeredPlayers.find(p => p.id === playerId); if (player) { updateRecord(setRegisteredPlayers, { ...player, isVerified: true, notifications: [...player.notifications, 'Your email has been verified.'] }); addToast(t('toast_success_email_verified'), 'success'); } };
    const updatePlayerStatus = (playerId: number, status: PlayerStatus) => { const player = registeredPlayers.find(p => p.id === playerId); if (player) { updateRecord(setRegisteredPlayers, { ...player, status, notifications: [...player.notifications, `Your status has been updated to ${status}.`] }); logAdminActivity(`Player status for ${player.name} updated to ${status}.`); addToast(t('toast_success_player_status_updated'), 'success'); } };
    const verifyPlayerDocuments = (playerId: number, isApproved: boolean) => { const player = registeredPlayers.find(p => p.id === playerId); if (player) { const status = isApproved ? 'verified' : 'approved'; const notification = isApproved ? 'Your documents have been verified.' : 'Your documents were rejected. Please review and re-upload.'; updateRecord(setRegisteredPlayers, { ...player, status, notifications: [...player.notifications, notification] }); logAdminActivity(`Player ${player.name}'s docs ${isApproved ? 'verified' : 'rejected'}.`); addToast(isApproved ? t('toast_success_docs_verified') : t('toast_success_docs_rejected'), 'success'); } };
    const assignPlayerTeam = (playerId: number, team: string | null) => { const player = registeredPlayers.find(p => p.id === playerId); if (player) { const status = team ? 'assigned' : 'verified'; const notification = team ? `You have been assigned to team ${team}.` : 'You have been unassigned from your team.'; updateRecord(setRegisteredPlayers, { ...player, team, status, notifications: [...player.notifications, notification] }); logAdminActivity(`Player ${player.name} assigned to ${team}.`); addToast(t('toast_success_player_team_assigned'), 'success'); } };
    const addPlayerDocuments = (playerId: number, documents: PlayerDocuments) => { const player = registeredPlayers.find(p => p.id === playerId); if (player) { const status: PlayerStatus = 'validated'; const notification = 'Your documents have been submitted for validation.'; updateRecord(setRegisteredPlayers, { ...player, documents, status, notifications: [...player.notifications, notification] }); logAdminActivity(`Player ${player.name} submitted documents.`); addToast(t('toast_success_documents_uploaded'), 'success'); } };
    const updatePlayer = (player: Player) => { updateRecord(setRegisteredPlayers, player); addToast(t('toast_success_player_updated'), 'success'); };
    const updatePlayerContactInfo = (playerId: number, data: { name: string; email: string; phone: string; }) => { const player = registeredPlayers.find(p => p.id === playerId); if (player) { updateRecord(setRegisteredPlayers, { ...player, ...data }); addToast(t('toast_success_account_updated'), 'success'); } };
    const addPlayer = (playerData: Omit<Player, 'id'>) => { addRecord(setRegisteredPlayers, playerData); addToast(t('toast_success_player_added'), 'success'); };
    const deletePlayer = (playerId: number) => { deleteRecord(setRegisteredPlayers, playerId); addToast(t('toast_success_player_deleted'), 'success'); };
    
    const updateCategoryRulesAndPlayers = (newRules: CategoryRule[]) => {
        setCategoryRules(newRules);
        setRegisteredPlayers(prevPlayers => prevPlayers.map(player => ({...player, category: getCategoryByYear(player.dob, newRules)})));
    };
    const addCategoryRule = (newRule: CategoryRule) => { updateCategoryRulesAndPlayers([...categoryRules, newRule]); addToast(t('toast_success_category_added'), 'success'); };
    const updateCategoryRules = (newRules: CategoryRule[]) => { updateCategoryRulesAndPlayers(newRules); addToast(t('toast_success_categories_updated'), 'success'); };
    const deleteCategoryRule = (categoryName: string) => { updateCategoryRulesAndPlayers(categoryRules.filter(rule => rule.name !== categoryName)); addToast(t('toast_success_category_deleted'), 'success'); };

    const addNewsArticle = (d: Omit<NewsArticle, 'id'>) => { addRecord(setNews, d); addToast(t('toast_success_news_added'),'success'); };
    const updateNewsArticle = (d: NewsArticle) => { updateRecord(setNews, d); addToast(t('toast_success_news_updated'),'success'); };
    const deleteNewsArticle = (id: number) => { deleteRecord(setNews, id); addToast(t('toast_success_news_deleted'),'success'); };
    const addMatch = (d: Omit<Match, 'id'>) => { addRecord(setMatches, d); addToast(t('toast_success_match_added'),'success'); };
    const updateMatch = (d: Match) => { updateRecord(setMatches, d); addToast(t('toast_success_match_updated'),'success'); };
    const deleteMatch = (id: number) => { deleteRecord(setMatches, id); addToast(t('toast_success_match_deleted'),'success'); };
    const addSponsor = (d: Omit<Sponsor, 'id'>) => { addRecord(setSponsors, d); addToast(t('toast_success_sponsor_added'),'success'); };
    const updateSponsor = (d: Sponsor) => { updateRecord(setSponsors, d); addToast(t('toast_success_sponsor_updated'),'success'); };
    const deleteSponsor = (id: number) => { deleteRecord(setSponsors, id); addToast(t('toast_success_sponsor_deleted'),'success'); };
    const addTeam = (d: Omit<Team, 'id'>) => { addRecord(setTeams, d); addToast(t('toast_success_team_added'),'success'); };
    const updateTeam = (d: Team) => { updateRecord(setTeams, d); addToast(t('toast_success_team_updated'),'success'); };
    const deleteTeam = (id: number) => { deleteRecord(setTeams, id); addToast(t('toast_success_team_deleted'),'success'); };
    const addStaffMember = (d: Omit<StaffMember, 'id'>) => { addRecord(setStaffMembers, d); addToast(t('toast_success_staff_added'),'success'); };
    const updateStaffMember = (d: StaffMember) => { updateRecord(setStaffMembers, d); addToast(t('toast_success_staff_updated'),'success'); };
    const deleteStaffMember = (id: number) => { deleteRecord(setStaffMembers, id); addToast(t('toast_success_staff_deleted'),'success'); };
    const addProduct = (d: Omit<Product, 'id'>) => { addRecord(setProducts, d); addToast(t('toast_success_product_added'),'success'); };
    const updateProduct = (d: Product) => { updateRecord(setProducts, d); addToast(t('toast_success_product_updated'),'success'); };
    const deleteProduct = (id: number) => { deleteRecord(setProducts, id); addToast(t('toast_success_product_deleted'),'success'); };

    const updateHomePageContent = (content: HomePageContent) => { setHomePageContent(content); addToast(t('toast_success_homepage_updated'),'success'); };
    const updateClubInfo = (info: ClubInfo) => { setClubInfo(info); addToast(t('toast_success_club_info_updated'),'success'); };
    const updateGeneralSettings = (settings: GeneralSettings) => { setGeneralSettings(settings); addToast(t('toast_success_settings_updated'),'success'); };

    const addOrder = (orderData: Omit<Order, 'id'>): number => {
        const newOrder = addRecord(setOrders, orderData);
        logAdminActivity(`New order #${newOrder.id} placed.`);
        addToast(t('toast_success_order_placed'), 'success');
        return newOrder.id;
    };
    const updateOrderStatus = (orderId: number, status: OrderStatus) => { const order = orders.find(o => o.id === orderId); if (order) { updateRecord(setOrders, { ...order, status }); logAdminActivity(`Order #${orderId} status updated to ${status}.`); addToast(t('toast_success_order_status_updated'), 'success'); } };
    
    const addTrackedCategory = (category: string) => { const newCategories = [...new Set([...trackedStandingCategories, category])]; setTrackedStandingCategories(newCategories); logAdminActivity(`Started tracking standings for category '${category}'.`); addToast(`Now tracking standings for ${category}`, 'success'); };
    const removeTrackedCategory = (category: string) => { const newCategories = trackedStandingCategories.filter(c => c !== category); setTrackedStandingCategories(newCategories); logAdminActivity(`Stopped tracking standings for category '${category}'.`); addToast(`Stopped tracking standings for ${category}`, 'info'); };
    
    const updateLiveScore = (matchId: number, score: LiveScore) => {
        setMatches(prevMatches =>
            prevMatches.map(match =>
                match.id === matchId ? { ...match, liveScore: score } : match
            )
        );
    };

    const value = {
        loading: false, fetchError: null,
        registeredPlayers, registerPlayer, findOrCreatePlayerByGoogle, verifyPlayerEmail, updatePlayerStatus, verifyPlayerDocuments, assignPlayerTeam, addPlayerDocuments, updatePlayer, updatePlayerContactInfo, addPlayer, deletePlayer,
        news, addNewsArticle, updateNewsArticle, deleteNewsArticle,
        matches, addMatch, updateMatch, deleteMatch,
        sponsors, addSponsor, updateSponsor, deleteSponsor,
        categoryRules, addCategoryRule, updateCategoryRules, deleteCategoryRule,
        teams, addTeam, updateTeam, deleteTeam,
        homePageContent, updateHomePageContent,
        clubInfo, updateClubInfo,
        staffMembers, addStaffMember, updateStaffMember, deleteStaffMember,
        generalSettings, updateGeneralSettings,
        adminActivity,
        products, addProduct, updateProduct, deleteProduct,
        orders, addOrder, updateOrderStatus,
        standings, trackedStandingCategories, addTrackedCategory, removeTrackedCategory,
        liveMatchId, setLiveMatchId,
        updateLiveScore,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}