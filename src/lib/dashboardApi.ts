import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
    revenue: {
        total: number;
        change: number;
    };
    orders: {
        total: number;
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
    products: {
        total: number;
        active: number;
        outOfStock: number;
    };
    views: {
        total: number;
        change: number;
    };
}

export async function fetchDashboardStats(supplierId: string): Promise<DashboardStats> {
    const stats: DashboardStats = {
        revenue: { total: 0, change: 0 },
        orders: { total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 },
        products: { total: 0, active: 0, outOfStock: 0 },
        views: { total: 0, change: 0 },
    };

    try {
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select(`
                status,
                id,
                view_count,
                product_variants (
                    stock_quantity
                )
            `)
            .eq('supplier_id', supplierId);

        if (productsError) throw productsError;

        if (products) {
            stats.products.total = products.length;
            stats.products.active = products.filter(p => p.status === 'active').length;
            stats.products.outOfStock = products.filter(p => {
                const variants = (p.product_variants as unknown as { stock_quantity: number }[]) || [];
                return variants.length === 0 || variants.every(v => (v.stock_quantity || 0) <= 0);
            }).length;
            stats.views.total = products.reduce((acc, p) => acc + (p.view_count || 0), 0);
        }

        const { data: orderItems, error: ordersError } = await supabase
            .from('order_items')
            .select(`
                total,
                status,
                order_id
            `)
            .eq('supplier_id', supplierId);

        if (ordersError) throw ordersError;

        if (orderItems) {
            stats.revenue.total = orderItems.reduce((acc, item) => acc + (item.total || 0), 0);

            const uniqueOrderIds = new Set();
            orderItems.forEach(item => {
                uniqueOrderIds.add(item.order_id);
                const status = (item.status || 'pending').toLowerCase();
                if (status in stats.orders) {
                    (stats.orders[status as keyof typeof stats.orders] as number)++;
                }
            });
            stats.orders.total = uniqueOrderIds.size;
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
    }

    return stats;
}

export async function fetchRecentOrders(supplierId: string, limit = 5) {
    const { data, error } = await supabase
        .from('order_items')
        .select(`
            id,
            quantity,
            total,
            created_at,
            status,
            orders!inner (
                id,
                order_number,
                user_id
            ),
            product_variants!inner (
                name,
                product_id,
                products!inner (
                    name,
                    product_images (
                        image_url
                    )
                )
            )
        `)
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false })
        .limit(limit);

    return { data, error };
}

export async function fetchHistoricalRevenue(supplierId: string, days = 30) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const { data, error } = await supabase
        .from('order_items')
        .select('total, created_at')
        .eq('supplier_id', supplierId)
        .gte('created_at', dateLimit.toISOString())
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching historical revenue:', error);
        return [];
    }

    // Process data for charts (group by day)
    const revenueByDay: Record<string, number> = {};

    // Initialize all days in the range with 0
    for (let i = 0; i <= days; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayKey = d.toISOString().split('T')[0];
        revenueByDay[dayKey] = 0;
    }

    data.forEach(item => {
        const dayKey = new Date(item.created_at).toISOString().split('T')[0];
        if (revenueByDay[dayKey] !== undefined) {
            revenueByDay[dayKey] += item.total || 0;
        }
    });

    return Object.entries(revenueByDay)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date));
}
