import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Award,
    TrendingUp,
    Flame,
    Trophy,
    Star,
    Package,
    ShoppingCart,
    MessageSquare,
    Bell,
    Calendar,
    ArrowRight,
    Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    fetchUserPoints,
    fetchUserAchievements,
    fetchLeaderboard,
    updateUserStreak,
    calculateProgress,
} from '@/lib/gamification-api';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AccountsDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [points, setPoints] = useState<any>(null);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [progress, setProgress] = useState({
        profile: 0,
        verification: 0,
        firstSale: 0,
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                navigate('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            setUser(profile);

            // Update streak
            await updateUserStreak();

            // Load points
            const { data: pointsData } = await fetchUserPoints();
            setPoints(pointsData);

            // Load achievements
            const { data: achievementsData } = await fetchUserAchievements();
            setAchievements(achievementsData || []);

            // Load leaderboard
            const { data: leaderboardData } = await fetchLeaderboard('points', 10);
            setLeaderboard(leaderboardData || []);

            // Calculate progress
            const { data: profileProgress } = await calculateProgress('profile_completion');
            const { data: verificationProgress } = await calculateProgress('verification');
            const { data: firstSaleProgress } = await calculateProgress('first_sale');

            setProgress({
                profile: profileProgress || 0,
                verification: verificationProgress || 0,
                firstSale: firstSaleProgress || 0,
            });

        } catch (error) {
            console.error('Error loading dashboard:', error);
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getLevelProgress = () => {
        if (!points) return 0;
        const currentLevelMin = points.level * 100;
        const nextLevelMin = (points.level + 1) * 100;
        const progress = ((points.total_points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
        return Math.min(Math.max(progress, 0), 100);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {getGreeting()}, {user?.full_name || 'User'}! 👋
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Welcome to your personalized dashboard
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="gap-1">
                                <Flame className="h-3 w-3 text-orange-500" />
                                {points?.streak_days || 0} day streak
                            </Badge>
                            <Button onClick={() => navigate('/profile')}>
                                View Profile
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                                <Star className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{points?.total_points || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    Level {points?.level || 1}
                                </p>
                                <Progress value={getLevelProgress()} className="mt-2" />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                                <Award className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{achievements.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Badges earned
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                                <Flame className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{points?.streak_days || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    Days active
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rank</CardTitle>
                                <Trophy className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">#{points?.current_rank || '-'}</div>
                                <p className="text-xs text-muted-foreground">
                                    Global ranking
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Progress</CardTitle>
                                <CardDescription>Complete these tasks to level up faster</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Complete Profile</span>
                                        <span className="text-sm text-muted-foreground">{progress.profile}%</span>
                                    </div>
                                    <Progress value={progress.profile} />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Get Verified</span>
                                        <span className="text-sm text-muted-foreground">{progress.verification}%</span>
                                    </div>
                                    <Progress value={progress.verification} />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">First Sale</span>
                                        <span className="text-sm text-muted-foreground">{progress.firstSale}%</span>
                                    </div>
                                    <Progress value={progress.firstSale} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Achievements */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Achievements</CardTitle>
                                <CardDescription>Badges you've earned</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {achievements.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No achievements yet</p>
                                        <p className="text-sm text-muted-foreground">
                                            Complete tasks to earn your first badge!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {achievements.slice(0, 6).map((achievement) => (
                                            <div
                                                key={achievement.id}
                                                className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="text-4xl mb-2">{achievement.achievement?.icon || '🏆'}</div>
                                                <p className="text-sm font-medium text-center">
                                                    {achievement.achievement?.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    +{achievement.achievement?.points} pts
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {achievements.length > 6 && (
                                    <Button variant="ghost" className="w-full mt-4">
                                        View All Achievements
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Activity Feed */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Your latest actions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <Zap className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Daily login streak!</p>
                                            <p className="text-xs text-muted-foreground">
                                                {points?.streak_days || 0} days in a row
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">Today</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Leaderboard */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Leaderboard</CardTitle>
                                <CardDescription>Top performers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {leaderboard.slice(0, 5).map((entry, index) => (
                                        <div
                                            key={entry.user_id}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold">
                                                {index + 1}
                                            </div>
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={entry.user?.avatar_url} />
                                                <AvatarFallback>
                                                    {entry.user?.full_name?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {entry.user?.full_name || 'User'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Level {entry.level}
                                                </p>
                                            </div>
                                            <div className="text-sm font-bold text-primary">
                                                {entry.total_points}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/messages')}>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Messages
                                </Button>
                                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/profile')}>
                                    <Bell className="h-4 w-4 mr-2" />
                                    Notifications
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Activity Log
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
