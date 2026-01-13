import { MessageSquare, Leaf, TrendingUp, Package, Shield, Truck } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-muted/30 p-8">
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center shadow-lg">
          <MessageSquare className="w-14 h-14 text-green-600" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
          <Leaf className="w-6 h-6 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">Harvestá Messages</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Connect with farmers, buyers, and logistics partners. 
        Negotiate deals, track orders, and grow your agro-business.
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
        <Feature 
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          title="Trade Easily" 
          description="Send offers and negotiate prices"
        />
        <Feature 
          icon={<Truck className="w-6 h-6 text-orange-500" />}
          title="Track Orders" 
          description="Real-time delivery updates"
        />
        <Feature 
          icon={<Package className="w-6 h-6 text-purple-600" />}
          title="Share Products" 
          description="Send catalogs and quotes"
        />
        <Feature 
          icon={<Shield className="w-6 h-6 text-green-600" />}
          title="Secure & Safe" 
          description="Protected transactions"
        />
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-4 bg-card rounded-xl border border-border hover:border-green-500/30 transition-colors">
      <div className="mb-2">{icon}</div>
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
