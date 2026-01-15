import { Shield, Truck, CheckCircle, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function TrustBadges() {
    const badges = [
        {
            icon: Shield,
            title: 'Secure Escrow',
            description: 'Payment held until delivery',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            icon: CheckCircle,
            title: 'Quality Check',
            description: 'Verified export standards',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            icon: Truck,
            title: 'Safe Logistics',
            description: 'Tracked & insured shipping',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            icon: Headphones,
            title: '24/7 Support',
            description: 'Instant dispute resolution',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 mt-6">
            {badges.map((badge, index) => (
                <Card key={index} className="border-none shadow-none bg-muted/30">
                    <CardContent className="p-4 flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${badge.bgColor} ${badge.color}`}>
                            <badge.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold">{badge.title}</h4>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
