import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, TrendingUp, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface GuestPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    timeOnPage: number;
    scrollDepth: number;
}

export function GuestPromptModal({ isOpen, onClose, timeOnPage, scrollDepth }: GuestPromptModalProps) {
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/register');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
                    >
                        <Card className="border-2 border-primary/20 shadow-2xl">
                            <CardHeader className="relative pb-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2"
                                    onClick={onClose}
                                >
                                    <X className="h-4 w-4" />
                                </Button>

                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <UserPlus className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Join Harvestá Today!</CardTitle>
                                        <CardDescription>
                                            Unlock exclusive features and benefits
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Benefits */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-lg">
                                        <Shield className="h-8 w-8 text-primary mb-2" />
                                        <p className="text-sm font-medium">Verified Sellers</p>
                                        <p className="text-xs text-muted-foreground">Trust & Safety</p>
                                    </div>

                                    <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-lg">
                                        <TrendingUp className="h-8 w-8 text-primary mb-2" />
                                        <p className="text-sm font-medium">Best Prices</p>
                                        <p className="text-xs text-muted-foreground">Direct from Farms</p>
                                    </div>

                                    <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-lg">
                                        <Zap className="h-8 w-8 text-primary mb-2" />
                                        <p className="text-sm font-medium">Fast Delivery</p>
                                        <p className="text-xs text-muted-foreground">Nationwide</p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex justify-around py-4 border-y">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">500+</p>
                                        <p className="text-xs text-muted-foreground">Verified Sellers</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">10k+</p>
                                        <p className="text-xs text-muted-foreground">Products</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-primary">50k+</p>
                                        <p className="text-xs text-muted-foreground">Happy Buyers</p>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        onClick={handleSignUp}
                                        className="w-full h-12 text-base"
                                        size="lg"
                                    >
                                        Create Free Account
                                    </Button>

                                    <Button
                                        onClick={handleLogin}
                                        variant="outline"
                                        className="w-full h-12 text-base"
                                        size="lg"
                                    >
                                        Sign In
                                    </Button>

                                    <Button
                                        onClick={onClose}
                                        variant="ghost"
                                        className="w-full text-sm"
                                    >
                                        Continue as Guest
                                    </Button>
                                </div>

                                {/* Footer Note */}
                                <p className="text-xs text-center text-muted-foreground">
                                    You've been browsing for {Math.floor(timeOnPage / 60)}:{(timeOnPage % 60).toString().padStart(2, '0')}
                                    {' '}and viewed {scrollDepth} products
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
